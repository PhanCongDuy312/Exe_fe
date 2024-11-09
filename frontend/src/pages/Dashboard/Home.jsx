import {Flex, Title, Button, Modal} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {IconPlus, IconQrcode} from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import GridLayout from "../../components/Layout/GridLayout";
import ProjectCard from "../../components/ProjectCard";
import appStrings from "../../utils/strings";
import YourProjectAction from "../../components/Actions/YourProjectAction";
import CreateProjectDrawer from "../Drawer/CreateProjectDrawer";
import AnalyzeProfileDrawer from "../Drawer/AnalyzeProfileDrawer.jsx";
import Empty from "../../components/Empty";

import { useEffect, useState } from "react";
import useGlobalState from "../../context/global";
import useProjectsState from "../../context/project";
import useNotification from "../../hooks/useNotification";

import { shareProjectApi } from "../../apis/projects";
import ShareProjectModal from "../Modal/ShareProjectModal";
import { findUsersByEmailApi } from "../../apis/user";
import axios from "axios";
import {openModal} from "@mantine/modals";

export default function HomePage() {
  const [isNewProjectOpen, newProjectToggle] = useDisclosure(false);
  const [isNewAnalyst, newAnalystToggle] = useDisclosure(false);

  const [isShareModalOpen, setIsShareModalOpen] = useDisclosure(false);
  const [selectedShareProject, setSelectedShareProject] = useState(null);
  const user = useGlobalState((state) => state.user);
  // const projects = useProjectsState((state) => state.projects);
  // const setProjects = useProjectsState((state) => state.setProjects);
  const shared = useProjectsState((state) => state.shared);
  // const setShared = useProjectsState((state) => state.setShared);
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });
  const [fileNames, setFileNames] = useState([]);
  const [jdNames, setJDNames] = useState([]);
  const [projects, setProjects] = useState([]); // State to hold projects
  const [openModal, setOpenModal] = useState(false);

  const fetchData = async () => {
    try {
      const result = await axios.get('http://18.142.57.218/get/cv');
      const jds = await axios.get('http://18.142.57.218/get/jd');
      const projects = await axios.get('http://18.142.57.218/get/project');

      const mappedAnalyze = projects.data.map((item) => ({
        id: item.cv_id,
        name: item.file_name,
        score: item.score,
        jdId: item.jd_id,
        projectId: item.project_id,
        keywords: item.matching_keyword_dict,
      }));
      // Map JDs
      const mappedJDs = jds.data.map((item) => ({
        id: item.id,
        name: item.file_name,
        description: item.public_url_path,
      }));

      // Map CVs
      const mappedProjects = result.data.map((item) => ({
        id: item.id,
        name: item.file_name,
        description: item.public_url_path,
      }));

      // Extract names for state
      const cvOptions = mappedProjects.map(item => ({
        value: item.id,  // Use id as the value
        label: item.name  // Use file_name as the label
      }));
      const jdOptions = mappedJDs.map(item => ({
        value: item.id,  // Use id as the value
        label: item.name  // Use file_name as the label
      }));

      const analyzeOptions = mappedAnalyze.map(item => ({
        id: item.projectId,
        // value: item.id,
        title: item.name,
        description: item.keywords,
        alias: item.score
      }))

      console.log(analyzeOptions);

      // Update state
      setFileNames(cvOptions);
      setJDNames(jdOptions);
      setProjects(analyzeOptions);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Optionally, show an error message to the user
    }
  };

  useEffect(() => {


    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts



  async function handleDeleteProject(id){
   const result = await  axios.delete(`http://18.142.57.218/get/delete_project?project_id=${id}`);
   if(result.data.message === "Project deleted successfully"){
     await fetchData();
     successNotify({
       message: "Project deleted successfully",
     })
   }
  }

  function handleShareProject(users) {
    if (selectedShareProject === null) return;
    shareProjectApi({
      ids: users.map((user) => user.id),
      projectId: projects[selectedShareProject].id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        successNotify({
          message: appStrings.language.share.shareProjectSuccessMessage,
        });
      },
    });
  }

  return (
      <>
        <Modal opened={openModal} onClose={() => setOpenModal(false)}>


        </Modal>
        <Flex direction="column" gap={30}>
          <HeadingLayout loading={user}>
            <Title order={1}>
              {appStrings.language.home.welcome}
              {user?.name}
            </Title>
            <Flex gap={5}>
              <Button
                  leftSection={<IconPlus size="1rem" />}
                  onClick={newAnalystToggle.open}
              >
                {"Phân tích mới"}
              </Button>
            </Flex>
          </HeadingLayout>
          {projects?.length !== 0 ? (
              <GridLayout
                  title={"Những phân tích gần đây"}
                  loading={!projects}
              >
                {projects?.map((data, index) => (
                    <ProjectCard
                        key={index}
                        id={data.id}
                        title={data.title}
                        alias={data.alias}
                        keyword={data.description}
                        actions={
                          <YourProjectAction
                              onShareTap={() => {
                                setIsShareModalOpen.open();
                                setSelectedShareProject(index);
                              }}
                              onDeleteTap={() => handleDeleteProject(data.id)}
                          />
                        }
                    />
                ))}
              </GridLayout>
          ) : !shared?.length ? (
              <Empty />
          ) : null}
          {/*{shared?.length !== 0 ? (*/}
          {/*  <GridLayout*/}
          {/*    title={appStrings.language.home.sharedProjects}*/}
          {/*    loading={shared}*/}
          {/*  >*/}
          {/*    {shared?.map((data, index) => (*/}
          {/*      <ProjectCard*/}
          {/*        key={index}*/}
          {/*        id={data.id}*/}
          {/*        title={data.name}*/}
          {/*        description={data.description}*/}
          {/*        alias={data.alias}*/}
          {/*        members={data.members}*/}
          {/*      />*/}
          {/*    ))}*/}
          {/*  </GridLayout>*/}
          {/*) : null}*/}
          <CreateProjectDrawer
              open={isNewProjectOpen}
              onClose={newProjectToggle.close}
          />
          <AnalyzeProfileDrawer
              open={isNewAnalyst}
              onClose={newAnalystToggle.close}
              fileNames={fileNames}
              jdNames={jdNames}
          />
          <ShareProjectModal
              open={isShareModalOpen}
              onClose={setIsShareModalOpen.close}
              onSearch={async (query) => findUsersByEmailApi(query)}
              onShare={handleShareProject}
          />
        </Flex>

      </>
  );
}
