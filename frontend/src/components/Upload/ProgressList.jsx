import {
  Paper,
  List,
  ThemeIcon,
  Loader,
  rem,
  Flex,
  Text,
  Button,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import appStrings from "../../utils/strings";

export default function ProgressList({ items, isClosable, onClose }) {
  return (
    <Paper shadow="lg" p="md" withBorder>
      <List spacing="md" center>
        {Object.entries(items).map(([name, progress], index) => (
          <List.Item
            key={index}
            icon={
              progress < 100 ? (
                <ThemeIcon size={24} radius="xl">
                  <Loader size={rem(16)} color="white" />
                </ThemeIcon>
              ) : (
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck
                    style={{ width: rem(16), height: rem(16) }}
                  />
                </ThemeIcon>
              )
            }
          >
            <Flex justify="space-between" gap="lg" align="center">
              {name}
              <Text c={progress < 100 ? "gray" : "teal"}>{progress}%</Text>
            </Flex>
          </List.Item>
        ))}
      </List>
      {isClosable ? (
        <Button onClick={onClose} size="xs" mt="md">
          {appStrings.language.btn.close}
        </Button>
      ) : null}
    </Paper>
  );
}
