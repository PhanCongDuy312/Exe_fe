/* eslint-disable react/prop-types */
import {
    Card,
    Title,
    Text,
    Group,
    ActionIcon,
    Avatar,
    Tooltip,
    Menu, Button,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function CVCard({
                                        id,
                                        title,
                                        description,
                                        alias,
                                        members,
                                        actions,
                                        keyword,
                                        disableNavigate = false,
                                    }) {
    const { hovered, ref } = useHover();
    const navigate = useNavigate();
    function handleNavigateToProject() {
        if (!disableNavigate) {
            navigate(`/${id}`);
        }
    }

    return (
        <Card withBorder ref={ref} shadow={hovered ? "xl" : "md"}>
            <Group justify="space-between">
                <Title
                    order={5}
                    onClick={handleNavigateToProject}
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
            <Group justify="space-between" align="flex-end">
                <Text size="xs" c="dimmed">
                    {alias}
                </Text>
                <a href={description} style={{textDecoration: "none"}}>
                    <Button size="xs" variant="light">
                        Tải xuống
                    </Button>
                </a>
                {members ? (
                    <Tooltip.Group openDelay={300} closeDelay={100}>
                        <Avatar.Group>
                            {members.slice(0, 4).map((member, index) => (
                                <Tooltip key={index} label={member.name} withArrow>
                                    <Avatar src={member.avatar} size="sm"/>
                                </Tooltip>
                            ))}
                            {members.length > 4 ? (
                                <Tooltip
                                    label={members.slice(4).map((member, index) => (
                                        <Text key={index}>{member.name}</Text>
                                    ))}
                                    withArrow
                                >
                                    <Avatar size="sm" c="gray" radius="lg">
                                        +{members.length - 4}
                                    </Avatar>
                                </Tooltip>
                            ) : null}
                        </Avatar.Group>
                    </Tooltip.Group>
                ) : null}
            </Group>
        </Card>
    );
}
