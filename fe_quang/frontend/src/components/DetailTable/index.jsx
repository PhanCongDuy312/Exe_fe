import { Badge, Flex, ScrollArea, Skeleton, Table, Title } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import Empty from "../Empty";
import appStrings from "../../utils/strings";

export default function DetailTable({ data }) {
  return data ? (
    <Flex direction="column" gap="lg">
      <Title order={3}>{appStrings.language.cvDetail.detailTable}</Title>
      {Object.keys(data).length ? (
        <ScrollArea h={500} mb="lg">
          {Object.entries(data).map(([key, value], index) => {
            const cri = key.split(":")[0];
            const kw = key.split(":")[1];
            return (
              <Flex key={index} direction="column" gap="md" mb="xl">
                <Flex gap="xs" align="center">
                  <Badge color="blue" radius="xl" size="md">
                    {cri}
                  </Badge>
                  <Title order={5}>{kw}</Title>
                </Flex>
                <Table striped highlightOnHover>
                  <Table.Tbody>
                    {Object.entries(value).map(([key, value], index) => {
                      const percent = Math.round(value * 100);
                      return (
                        <Table.Tr key={index}>
                          <Table.Td c={key === "overall" ? "blue" : "gray"}>
                            {key === "overall"
                              ? appStrings.language.cvDetail.overall
                              : key}
                          </Table.Td>
                          <Table.Td>
                            {percent ? (
                              `${percent}%`
                            ) : (
                              <IconX size="1rem" color="red" />
                            )}
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </Flex>
            );
          })}
        </ScrollArea>
      ) : (
        <Empty />
      )}
    </Flex>
  ) : (
    <Skeleton height={500} />
  );
}
