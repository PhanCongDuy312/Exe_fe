import {Card, Text, Grid, Title, Flex, Center} from '@mantine/core';
import HeadingLayout from "../../components/Layout/HeadingLayout";
import appStrings from "../../utils/strings";
import logo from "../../assets/QR1.jpg";
import { useEffect } from "react";
import { getTrashProjectsApi, getYourProjectsApi } from "../../apis/dashboard";
import useProjectsState from "../../context/project";
import {
  restoreProjectApi,
  deletePermanentlyProjectApi,
} from "../../apis/projects";
import useNotification from "../../hooks/useNotification";
import useConfirmModal from "../../hooks/useConfirmModal";

export default function TrashPage() {
  const setProjects = useProjectsState((state) => state.setProjects);
  const trash = useProjectsState((state) => state.trash);
  const setTrash = useProjectsState((state) => state.setTrash);
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });

  function handleDeletePermanently(id) {
    deletePermanentlyProjectApi({
      id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        getTrashProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setTrash([]);
          },
          onSuccess: (data) => {
            successNotify({
              message:
                appStrings.language.trashProjects
                  .deletePermanentlySuccessMessage,
            });
            setTrash(data);
          },
        });
        getYourProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setProjects([]);
          },
          onSuccess: (data) => setProjects(data),
        });
      },
    });
  }

  const triggerDeletePermanentlyConfirm = useConfirmModal({
    type: "delete",
    onOk: handleDeletePermanently,
  });

  function handleRestoreProject(id) {
    restoreProjectApi({
      id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        getTrashProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setTrash([]);
          },
          onSuccess: (data) => {
            successNotify({
              message:
                appStrings.language.trashProjects.restoreProjectSuccessMessage,
            });
            setTrash(data);
          },
        });
        getYourProjectsApi({
          onFail: (msg) => {
            errorNotify({ message: msg });
            setProjects([]);
          },
          onSuccess: (data) => setProjects(data),
        });
      },
    });
  }

  useEffect(() => {
    if (!trash) {
      getTrashProjectsApi({
        onFail: (msg) => {
          errorNotify({ message: msg });
          setTrash([]);
        },
        onSuccess: (data) => setTrash(data),
      });
    }
  }, [setTrash]);

  const listings = [
    {
      id: 1,
      image: 'src/assets/QR1.jpg',
      title: 'Gói cơ bản',
      description: '100.000 vnđ / 1 tháng',
    },
    {
      id: 2,
      image: 'src/assets/QR1.jpg',
      title: 'Gói nâng cao',
      description: '449.000 vnđ / 6 tháng',
    },
    {
      id: 3,
      image: 'src/assets/QR1.jpg',
      title: 'Gói cao cấp',
      description: '799.000 vnđ / 1 năm',
    },
  ];

  return (
      <Flex direction="column" gap={30}>
        <HeadingLayout loading={!trash}>
          <Title order={2}>{"Thanh toán"}</Title>
          <Flex>
            {/*<Button leftSection={<Icon size="1rem" />}>*/}
            {/*  {appStrings.language.trashProjects.deletePermanentlyBtn}*/}
            {/*</Button>*/}
          </Flex>
        </HeadingLayout>
        <div className="flex justify-center items-center h-screen">
          <Grid gutter="md" justify="center">
            {listings.map((listing) => (
                <Grid.Col key={listing.id} span={4}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section display="inline-block" >
                      <Center>
                        <img align="center" src={logo} alt={listing.title}/>
                      </Center>
                    </Card.Section>
                    <Text align="center" weight={500} size="lg" mt="md">
                      {listing.title}
                    </Text>
                    <Text size="sm" color="dimmed" align="center" mt="xs">
                      {listing.description}
                    </Text>
                  </Card>
                </Grid.Col>
            ))}
          </Grid>
        </div>
      </Flex>
  );
}
