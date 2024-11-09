import { Flex, Text } from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";
import appStrings from "../../utils/strings";

export default function Empty({ message }) {
  return (
    <Flex direction="column" align="center" p="lg">
      <IconDatabaseOff size="2rem" color="gray" />
      <Text align="center" c="gray">
        {message || appStrings.language.utils.emptyData}
      </Text>
    </Flex>
  );
}
