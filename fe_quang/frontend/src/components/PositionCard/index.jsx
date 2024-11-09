import {
  Card,
  Title,
  Text,
  Group,
  ActionIcon,
  Menu,
  Badge,
  Flex,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useHover } from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";

export default function PositionCard({
  id,
  title,
  description,
  alias,
  startDate,
  endDate,
  actions,
}) {
  const { hovered, ref } = useHover();
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];

  function handleNavigateToProject(alias) {
    navigate(`/${projectId}/${id}`);
  }

  return (
    <Card withBorder ref={ref} shadow={hovered ? "xl" : "md"}>
      <Group justify="space-between">
        <Title
          order={5}
          onClick={() => handleNavigateToProject(alias)}
          style={{
            cursor: "pointer",
          }}
        >
          {title}
        </Title>
        {actions ? (
          <Menu withinPortal shadow="md" position="top-end" width={150}>
            <Menu.Target>
              <ActionIcon variant="light" color="gray">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown p={5}>{actions}</Menu.Dropdown>
          </Menu>
        ) : null}
      </Group>
      <Text size="sm">{description}</Text>
      <Group justify="space-between" align="flex-end">
        <Text size="xs" c="dimmed">
          {alias}
        </Text>
        <Flex gap="xs">
          <Badge variant="light" color="teal">
            {startDate}
          </Badge>
          <Badge variant="light" color="red">
            {endDate}
          </Badge>
        </Flex>
      </Group>
    </Card>
  );
}
