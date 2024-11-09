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
import {useState} from "react";

export default function JDCard({
                                        id,
                                        title,
                                        description,
                                        alias,
                                        members,
                                        actions,
                                        keyword,
                                        disableNavigate = false,
                                    }) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    function handleNavigateToProject() {
        if (!disableNavigate) {
            navigate(`/${id}`);
        }
    }

    return (
        <Card
            withBorder
            shadow={hovered ? "xl" : "md"}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            padding="md"
            radius="md"
        >
            <Group position="apart" align="center" mb="xs">
                <Title
                    order={5}
                    style={{
                        cursor: "pointer",
                        color: hovered ? "#1c7ed6" : "inherit",
                    }}
                >
                    {title}
                </Title>

                {actions && (
                    <Menu withinPortal shadow="md" position="top-end" width={150}>
                        <Menu.Target>
                            <ActionIcon variant="light" color="gray">
                                <IconDots />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown p="sm">{actions}</Menu.Dropdown>
                    </Menu>
                )}
            </Group>

            <Group position="apart" align="center" mt="sm">
                <Text size="sm" color="dimmed">
                    {alias}
                </Text>

                <a href={description} style={{ textDecoration: "none" }}>
                    <Button size="xs" variant="light">
                        Tải xuống
                    </Button>
                </a>
                {members && (
                    <Tooltip.Group openDelay={300} closeDelay={100}>
                        <Avatar.Group spacing="sm">
                            {members.slice(0, 4).map((member, index) => (
                                <Tooltip key={index} label={member.name} withArrow>
                                    <Avatar src={member.avatar} size="sm" radius="xl" />
                                </Tooltip>
                            ))}
                            {members.length > 4 && (
                                <Tooltip
                                    label={members.slice(4).map((member, index) => (
                                        <Text key={index} size="xs">{member.name}</Text>
                                    ))}
                                    withArrow
                                >
                                    <Avatar size="sm" color="gray" radius="xl">
                                        +{members.length - 4}
                                    </Avatar>
                                </Tooltip>
                            )}
                        </Avatar.Group>
                    </Tooltip.Group>
                )}
            </Group>
        </Card>
    );
}
