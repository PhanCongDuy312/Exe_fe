import { Card, Flex, SegmentedControl, Text } from "@mantine/core";

export default function SelectSettingCard({
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
        <SegmentedControl data={options} value={value} onChange={onChange} />
      </Flex>
    </Card>
  );
}
