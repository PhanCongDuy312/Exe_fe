import {Flex, Title, Button, Input, Loader} from "@mantine/core";
import {IconPlus, IconSearch} from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import GridLayout from "../../components/Layout/GridLayout";

import {useEffect, useState} from "react";
import UploadJDDrawer from "../Drawer/UploadJDDrawer.jsx";
import axios from "axios";
import {useDisclosure} from "@mantine/hooks";
import useSearch from "../../hooks/useSearch.js";
import appStrings from "../../utils/strings.js";
import JDCard from "../../components/ProjectCard/JDCard.jsx";
import YourProjectAction from "../../components/Actions/YourProjectAction.jsx";
import useNotification from "../../hooks/useNotification.js";

export default function SharedProjectPage() {
  const [isNewProjectOpen, isNewProjectToggle] = useDisclosure(false);
  const [projects, setProjects] = useState([]); // State to hold projects
    const [isShareModalOpen, setIsShareModalOpen] = useDisclosure(false);
    const [selectedShareProject, setSelectedShareProject] = useState(null);
    const errorNotify = useNotification({ type: "error" });
    const successNotify = useNotification({ type: "success" });
    const fetchData = async () => {
        try {
            const result = await axios.get('http://18.142.57.218/get/jd');

            // Assuming result.data contains the array
            const mappedProjects = result.data.map((item) => ({
                id: item.id,
                name: item.file_name,
                description: item.public_url_path,
            }));

            setProjects(mappedProjects); // Update state with the fetched projects
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const {
        search: currentProjects,
        isSearching,
        handleSearch,
    } = useSearch(projects, handleSearchProjects);

    async function handleDeleteProject(id){
        const result = await  axios.delete(`http://18.142.57.218/get/delete_jd?jd_id=${id}`);
        if(result.data.message === "JD deleted successfully"){
            await fetchData();
            successNotify({
                message: "JD đã được xoá thành công",
            })
        }
    }

  return (
    <Flex direction="column" gap={30}>
      <HeadingLayout loading={!currentProjects}>
        <Title order={2}>{"Những mô tả công việc đã thêm"}</Title>
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
            {"Thêm JD mới"}
          </Button>
        </Flex>
      </HeadingLayout>
      <GridLayout
          title={"JDs gần đây"}
          loading={!currentProjects}
      >
        {currentProjects?.map((data, index) => (
            <JDCard
                key={index}
                id={data.id}
                title={data.name}
                description={data.description}
                actions={
                    <YourProjectAction
                        onDeleteTap={() => handleDeleteProject(data.id)}
                    />
                }
            />
        ))}
      </GridLayout>
      <UploadJDDrawer
          open={isNewProjectOpen}
          onClose={isNewProjectToggle.close}
      />
    </Flex>
  );
}
