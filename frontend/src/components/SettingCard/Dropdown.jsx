import { Card, Flex, Select, Text } from "@mantine/core";

export default function DropdownSettingCard({
  title,
  options,
  warning,
  value,
  onChange,
}) {
  return (
    <Card shadow="xs" padding="md">
      <Flex align="center" justify="space-between">
        <Flex direction="column">
          <Text order={5}>{title}</Text>
          <Text c="red" size="sm">
            {warning}
          </Text>
        </Flex>
        <Select
          withCheckIcon={false}
          data={options}
          value={value}
          onChange={onChange}
          allowDeselect={false}
        />
      </Flex>
    </Card>
  );
}
