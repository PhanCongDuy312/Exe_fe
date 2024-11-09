import {
  AppShell,
  Flex,
  Group,
  Container,
  Burger,
  Select,
  ActionIcon,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Logo from "../Logo";
import Navbar from "../Navbar";
import User from "../User";
import appStrings from "../../utils/strings";

import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import useProjectsState from "../../context/project";
import { logoutApi } from "../../apis/auth";
import useNotification from "../../hooks/useNotification";
import usePositionsState from "../../context/position";

export default function AppLayout({
  children,
  navItems = [],
  navPreItems = [],
  navPostItems = [],
  aside,
}) {
  const [opened, { toggle }] = useDisclosure();
  const [asideOpened, { toggle: toggleAside }] = useDisclosure();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const location = useLocation();
  const projects = useProjectsState((state) => state.projects);
  const shared = useProjectsState((state) => state.shared);
  const setPositions = usePositionsState((state) => state.setPositions);
  const projectId = location.pathname.split("/")[1];
  const isDashboard = location.pathname.includes("dashboard");
  const errorNotify = useNotification({ type: "error" });

  function handleNavigateToDashboard() {
    navigate("/dashboard");
    setPositions(null);
  }

  function handleLogout() {
    // Logout
    logoutApi({
      onFail: (msg) => {
        errorNotify(msg);
      },
      onSuccess: () => {
        // Navigate to login page
        navigate("/login");
      },
    });
  }

  function handleNavigateToSettings() {
    navigate("/dashboard/setting");
  }

  function handleViewUser() {}

  function handleChangeProject(id) {
    navigate(`/${id}`);
    setPositions(null);
    window.location.reload();
  }

  function getActiveIndex() {
    let activeIndex = navItems.findIndex(
      (item) => item.to === location.pathname
    );
    if (activeIndex === -1) {
      activeIndex = navPreItems.findIndex(
        (item) => item.to === location.pathname
      );
    }
    if (activeIndex === -1) {
      activeIndex = navPostItems.findIndex(
        (item) => item.to === location.pathname
      );
    }
    return activeIndex;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Flex h="100%" align="center" justify="space-between" px="xl">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Logo size={35} onTap={handleNavigateToDashboard} />
            {projects && shared && !isDashboard ? (
              <Select
                w="13rem"
                allowDeselect={false}
                variant="light"
                value={projectId}
                data={[
                  {
                    group: appStrings.language.yourProject.title,
                    items: projects.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })),
                  },
                  {
                    group: appStrings.language.sharedProjects.title,
                    items: shared.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })),
                  },
                ]}
                onChange={(value) => handleChangeProject(value)}
              />
            ) : null}
          </Group>
          <User
            onUserTap={handleViewUser}
            onLogoutTap={handleLogout}
            onSettingTap={handleNavigateToSettings}
          />
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar
          activeIndex={getActiveIndex()}
          preItems={navPreItems}
          items={navItems}
          postItems={navPostItems}
        />
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          marginRight: asideOpened
            ? "40rem"
            : aside && !isMobile
            ? "48px"
            : "0",
        }}
      >
        <Container
          style={{
            maxWidth: "1400px",
            width: "100%",
          }}
        >
          {children}
        </Container>
      </AppShell.Main>
      {aside && !isMobile ? (
        <AppShell.Aside w={asideOpened ? "40rem" : "auto"}>
          {asideOpened ? (
            <Flex direction="column" p="md" gap="md">
              <ActionIcon onClick={toggleAside} variant="subtle">
                <IconChevronRight size="1rem" />
              </ActionIcon>
              {aside}
            </Flex>
          ) : (
            <Flex direction="column" p="xs">
              <ActionIcon onClick={toggleAside} variant="subtle">
                <IconChevronLeft size="1rem" />
              </ActionIcon>
            </Flex>
          )}
        </AppShell.Aside>
      ) : null}
    </AppShell>
  );
}
