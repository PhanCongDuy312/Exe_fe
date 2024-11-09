import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, LoadingOverlay } from "@mantine/core";
import {
  IconSquare,
  IconChartBar,
  IconSettings,
  IconSettingsFilled,
} from "@tabler/icons-react";
import AppLayout from "../../components/Layout/AppLayout";
import appStrings from "../../utils/strings";
import { useEffect } from "react";
import { getSharedProjectsApi, getYourProjectsApi } from "../../apis/dashboard";
import useProjectsState from "../../context/project";
import { getCurrentUserApi } from "../../apis/auth";
import useGlobalState from "../../context/global";
import useNotification from "../../hooks/useNotification";

export default function ProjectPageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const projects = useProjectsState((state) => state.projects);
  const setProjects = useProjectsState((state) => state.setProjects);
  const shared = useProjectsState((state) => state.shared);
  const setShared = useProjectsState((state) => state.setShared);
  const user = useGlobalState((state) => state.user);
  const setUser = useGlobalState((state) => state.setUser);
  const errorNotify = useNotification({ type: "error" });

  const navbarItems = [
    {
      label: appStrings.language.position.title,
      icon: <IconSquare size="1rem" />,
      activeIcon: <IconSquare size="1rem" />,
      to: `/${projectId}`,
    },
    {
      label: appStrings.language.insight.title,
      icon: <IconChartBar size="1rem" />,
      activeIcon: <IconChartBar size="1rem" />,
      to: `/${projectId}/insights`,
    },
  ];

  const navbarSettings = [
    {
      label: appStrings.language.setting.title,
      icon: <IconSettings size="1rem" />,
      activeIcon: <IconSettingsFilled size="1rem" />,
      to: `/${projectId}/setting`,
    },
  ];

  useEffect(() => {
    // Fetch user data
    getCurrentUserApi({
      user,
      onFail: (msg) => {
        errorNotify({ message: msg });
        navigate("/login");
      },
      onSuccess: (user) => {
        setUser(user);
        // Fetch projects data
        if (!projects) {
          getYourProjectsApi({
            onFail: (msg) => {
              errorNotify({ message: msg });
              setProjects([]);
            },
            onSuccess: (data) => {
              setProjects(data);
            },
          });
        }
        // Fetch shared projects data
        if (!shared) {
          getSharedProjectsApi({
            onFail: (msg) => {
              errorNotify({ message: msg });
              setShared([]);
            },
            onSuccess: (data) => {
              setShared(data);
            },
          });
        }
      },
    });
  }, [setProjects, setShared]);

  return (
    <AppLayout navItems={navbarItems} navPostItems={navbarSettings}>
      <Outlet />
    </AppLayout>
  );
}
