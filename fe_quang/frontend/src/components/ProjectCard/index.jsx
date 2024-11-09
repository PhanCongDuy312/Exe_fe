/* eslint-disable react/prop-types */
import {
  Card,
  Title,
  Text,
  Group,
  ActionIcon,
  Avatar,
  Tooltip,
  Menu, Modal, ScrollArea, Grid, Box, useMantineTheme, Badge,
} from "@mantine/core";
import {useDisclosure, useHover} from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";

export default function ProjectCard({
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
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  return (

      <>
          <Modal
              className="z-[1000]"
              opened={opened}
              size="70%"
              onClose={close}
              title={`Tên phân tích: ${title}`}
              centered
              zIndex={1000}
              overlayProps={{
                  backgroundOpacity: 0.55,
                  blur: 5,
              }}
              scrollAreaComponent={ScrollArea.Autosize}
          >
              <Box p="md">
                  <Group justify="space-between" align="center" mb="lg" style={{ width: "100%" }}>
                      <Text size="lg" weight={600} style={{ flex: 1, textAlign: "start" }}>
                          Kết quả phân tích
                      </Text>
                      <Text size="lg" weight={500} style={{ flex: 1, textAlign: "end" }}>
                          Phần trăm phù hợp với công việc: <Badge color="green" size="lg" variant="filled">{alias}%</Badge>
                      </Text>
                  </Group>



                  <Grid gutter="md">
                      {Object.entries(keyword).map(([skill, value]) => (
                          <Grid.Col xs={12} sm={6} md={4} key={skill}>
                              <Card
                                  shadow="sm"
                                  padding="lg"
                                  radius="md"
                                  style={{
                                      backgroundColor: value !== "None" ? theme.colors.blue[0] : theme.colors.gray[0],
                                  }}
                              >
                                  <Text size="md" weight={600} color="blue.7">
                                      Yêu cầu công việc: {skill}
                                  </Text>
                                  <Text color={value !== "None" ? "dark" : "dimmed"} size="sm">
                                      Hồ sơ của bạn: {value !== "None" ? value : "Không có"}
                                  </Text>
                              </Card>
                          </Grid.Col>
                      ))}
                  </Grid>
              </Box>
          </Modal>
        <Card withBorder ref={ref} shadow={hovered ? "xl" : "md"}>
          <Group justify="space-between">
            <Title
                order={5}
                onClick={open}
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
            <Text size="sm" c="dimmed">
              Phần trăm phù hợp: {alias}%
            </Text>
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

      </>
  );
}
