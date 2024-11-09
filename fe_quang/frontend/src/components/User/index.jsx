import { Avatar, Menu, Text, Title, Skeleton } from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import useGlobalState from "../../context/global";
import appStrings from "../../utils/strings";
import ava from "../../assets/ava.jpg"

export default function User({ onUserTap, onSettingTap, onLogoutTap }) {
  const user = useGlobalState((state) => state.user);

  return (
    <Menu shadow="md" width={250}>
      <Menu.Target>
        {user ? <Avatar src={user.avatar} /> : <Avatar />}
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={onUserTap}>
          <Title size="sm">{user?.name}</Title>
          <Text size="xs">{user?.email}</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconSettings size="1rem" />}
          onClick={onSettingTap}
        >
          {appStrings.language.setting.title}
        </Menu.Item>
        <Menu.Item
          leftSection={<IconLogout size="1rem" />}
          color="red"
          onClick={onLogoutTap}
        >
          {appStrings.language.auth.logout}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
