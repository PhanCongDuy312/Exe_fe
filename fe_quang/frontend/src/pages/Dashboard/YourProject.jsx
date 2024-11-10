import { Title, Flex, Button, Input, Loader } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import GridLayout from "../../components/Layout/GridLayout";
import ProjectCard from "../../components/ProjectCard";
import CreateProjectDrawer from "../Drawer/CreateProjectDrawer";
import YourProjectAction from "../../components/Actions/YourProjectAction";
import Empty from "../../components/Empty";
import appStrings from "../../utils/strings";

import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import useProjectsState from "../../context/project";
import { getYourProjectsApi, getTrashProjectsApi } from "../../apis/dashboard";
import { deleteProjectApi, shareProjectApi } from "../../apis/projects";
import useNotification from "../../hooks/useNotification";
import useSearch from "../../hooks/useSearch";
import ShareProjectModal from "../Modal/ShareProjectModal";
import { findUsersByEmailApi } from "../../apis/user";
import axios from "axios";
import CVCard from "../../components/ProjectCard/CVCard.jsx";

export default function YourProjectPage() {
  const [isNewProjectOpen, isNewProjectToggle] = useDisclosure(false);
  const [isShareModalOpen, setIsShareModalOpen] = useDisclosure(false);
  const [selectedShareProject, setSelectedShareProject] = useState(null);
  const setTrash = useProjectsState((state) => state.setTrash);
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });
  const [projects, setProjects] = useState([]); // State to hold projects

  const fetchData = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found. Please log in first.');
      }
  
      // Set up headers with the token
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      // Make the API request with the token in headers
      const result = await axios.get('https://jobfitserver.id.vn/get/cv', { headers });
  
      // Assuming result.data contains the array
      const mappedProjects = result.data.map((item) => ({
        id: item.id,
        name: item.file_name,
        description: item.public_url_path,
      }));
  
      console.log(mappedProjects); // Log the mapped projects
      setProjects(mappedProjects); // Update state with the fetched projects
    } catch (error) {
      console.error('Error fetching data:', error);
      // Optionally, show an error message to the user
    }
  };
  
  useEffect(() => {


    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts


  function handleSearchProjects(query) {
    if (!query) return projects;
    const searchedProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    return searchedProjects;
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

  const {
    search: currentProjects,
    isSearching,
    handleSearch,
  } = useSearch(projects, handleSearchProjects);

  async function handleDeleteProject(id){
    const result = await  axios.delete(`https://jobfitserver.id.vn/get/delete_cv?cv_id=${id}`);
    if(result.data.message === "CV deleted successfully"){
      await fetchData();
      successNotify({
        message: "Project deleted successfully",
      })
    }
  }

  return (
    <Flex direction="column" gap={30}>
      <HeadingLayout loading={!currentProjects}>
        <Title order={2}>{"CVs của bạn"}</Title>
        <Flex gap={15}>
          <Input
            placeholder={appStrings.language.yourProject.searchPlaceholder}
            leftSection={
              isSearching ? <Loader size="1rem" /> : <IconSearch size="1rem" />
            }
            onChange={(e) => handleSearch(e.currentTarget.value)}
          />
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={isNewProjectToggle.open}
          >
            {"Thêm CV mới"}
          </Button>
        </Flex>
      </HeadingLayout>
      {currentProjects?.length !== 0 ? (
        <GridLayout loading={!currentProjects}>
          {currentProjects?.map((data, index) => (
            <CVCard
              key={data.id}
              id={data.id}
              title={data.name}
              description={data.description}
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
      ) : (
        <Empty />
      )}
      <CreateProjectDrawer
        open={isNewProjectOpen}
        onClose={isNewProjectToggle.close}
      />
      <ShareProjectModal
        open={isShareModalOpen}
        onClose={setIsShareModalOpen.close}
        onSearch={async (query) => findUsersByEmailApi(query)}
        onShare={handleShareProject}
      />
    </Flex>
  );
}
