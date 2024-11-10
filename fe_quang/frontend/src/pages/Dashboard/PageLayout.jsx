import AppLayout from "../../components/Layout/AppLayout";
import {
  IconHome,
  IconHomeFilled,
  IconPerspective,
  IconShare,
  IconTrash,
  IconTrashFilled,
  IconSettings,
  IconSettingsFilled,
  IconGraph,
  IconGraphFilled,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconFileCv,
  IconQrcode,
  IconQrcodeOff,
  IconBriefcase,
} from "@tabler/icons-react";
import appStrings from "../../utils/strings";

import useGlobalState from "../../context/global";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUserApi } from "../../apis/auth";
import useNotification from "../../hooks/useNotification";
import {Modal} from "@mantine/core";

const navbarItems = [
  {
    label: "Dự án",
    icon: <IconBriefcase size="1rem" />,
    activeIcon: <IconBriefcase size="1rem" />,
    to: "/dashboard",
  },
  {
    label: "Hồ sơ công việc",
    icon: <IconFileCv size="1rem" />,
    activeIcon: <IconFileCv size="1rem" />,
    to: "/dashboard/your-project",
  },
  {
    label: "Mô tả công việc",
    icon: <IconFileTypePdf size="1rem" />,
    activeIcon: <IconFileTypePdf size="1rem" />,
    to: "/dashboard/shared-project",
  },

  {
    label: "Thanh toán",
    icon: <IconQrcode size="1rem" />,
    activeIcon: <IconQrcode size="1rem" />,
    to: "/dashboard/deleted-project",
  },
];

const navbarSettings = [
  {
    label: appStrings.language.setting.title,
    icon: <IconSettings size="1rem" />,
    activeIcon: <IconSettingsFilled size="1rem" />,
    to: "/dashboard/setting",
  },
];

export default function DashboardPageLayout() {
  const navigate = useNavigate();
  const user = useGlobalState((state) => state.user);
  const setUser = useGlobalState((state) => state.setUser);
  const errorNotify = useNotification({ type: "error" });

  useEffect(() => {
    getCurrentUserApi({
      user: user,
      onFail: (msg) => {
        errorNotify({ message: msg });
        navigate("/login");
      },
      onSuccess: (user) => {
        setUser(user);
      },
    });
  }, [setUser]);

  return (
    <AppLayout navItems={navbarItems} navPostItems={navbarSettings}>
      <Outlet />
    </AppLayout>
  );
}
