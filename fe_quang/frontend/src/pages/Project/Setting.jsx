import { Flex, Title, ActionIcon, Group, Avatar, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import appStrings from "../../utils/strings";
import SettingLayout from "../../components/Layout/SettingLayout";
import TableSettingCard from "../../components/SettingCard/Table";
import { useEffect, useState } from "react";
import useGlobalState from "../../context/global";
import useProjectsState from "../../context/project";
import { useLocation } from "react-router-dom";
import useConfirmModal from "../../hooks/useConfirmModal";
import {
  getProjectByIdApi,
  removeAccessApi,
  shareProjectApi,
} from "../../apis/projects";
import useNotification from "../../hooks/useNotification";
import { useDisclosure } from "@mantine/hooks";
import ShareProjectModal from "../Modal/ShareProjectModal";
import { findUsersByEmailApi } from "../../apis/user";

export default function ProjectSettingPage() {
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const [isShareModalOpen, setIsShareModalOpen] = useDisclosure(false);
  const user = useGlobalState((state) => state.user);
  const projects = useProjectsState((state) => state.projects);
  const shared = useProjectsState((state) => state.shared);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [isDisableActions, setIsDisableActions] = useState(false);
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });

  function handleRemoveAccess(id) {
    removeAccessApi({
      ids: [id],
      projectId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        successNotify({
          message: appStrings.language.setting.member.removeAccessSuccess,
        });
        setMembers(members.filter((mem) => mem.id !== id));
      },
    });
  }

  const removeAccessTrigger = useConfirmModal({
    type: "delete",
    onOk: handleRemoveAccess,
  });

  function handleShareProject(users) {
    shareProjectApi({
      ids: users.map((user) => user.id),
      projectId: projectId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        successNotify({
          message: appStrings.language.share.shareProjectSuccessMessage,
        });
        setMembers([
          ...members,
          ...users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: appStrings.language.setting.member.roles.member,
          })),
        ]);
      },
    });
  }

  useEffect(() => {
    // Find the project by id
    let project = projects?.find((project) => project.id === projectId);
    // If the project is not found in the owned projects, find it in the shared projects
    if (!project) {
      project = shared?.find((project) => project.id === projectId);
      setIsDisableActions(true);
    }
    setProject(project);
    // If the project is found, set the members
    if (project) {
      const mems = project.members.map((mem) => ({
        id: mem.id,
        name: mem.name,
        email: mem.email,
        avatar: mem.avatar,
        role: appStrings.language.setting.member.roles.member,
      }));
      // Append the owner to the members if the user is the owner
      if (project.owner === user?.id) {
        mems.unshift({
          id: user?.id,
          name: user?.name,
          email: user?.email,
          avatar: user?.avatar,
          role: appStrings.language.setting.member.roles.owner,
        });
      }
      setMembers(mems);
    } else {
      setMembers([]);
    }
  }, [projects, shared]);

  return (
    <Flex direction="column" gap="md">
      <HeadingLayout>
        <Title order={2}>{appStrings.language.setting.heading}</Title>
      </HeadingLayout>
      <SettingLayout title={appStrings.language.setting.member.title}>
        <TableSettingCard
          loading={!projects || !shared}
          disableActions={user?.id !== project?.owner}
          onShareTap={setIsShareModalOpen.open}
          data={members.map((member) => {
            return [
              <Group>
                <Avatar size="sm" radius="xl" src={member.avatar} />
                {member.name}
              </Group>,
              member.email,
              member.role,
              user?.id === project?.owner &&
              member.role !== appStrings.language.setting.member.roles.owner ? (
                <Tooltip label={appStrings.language.btn.delete}>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    color="red"
                    onClick={() => removeAccessTrigger(member.id)}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Tooltip>
              ) : null,
            ];
          })}
        />
      </SettingLayout>
      <ShareProjectModal
        open={isShareModalOpen}
        onClose={setIsShareModalOpen.close}
        onSearch={async (query) => findUsersByEmailApi(query)}
        onShare={handleShareProject}
      />
    </Flex>
  );
}
