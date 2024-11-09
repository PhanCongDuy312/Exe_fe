import {
  Paper,
  Menu,
  Flex,
  Card,
  Text,
  TextInput,
  NumberInput,
  ActionIcon,
  Badge,
  Fieldset,
  Button,
  Title,
  SimpleGrid,
  Textarea,
  Radio,
  Checkbox,
} from "@mantine/core";
import { IconDots, IconCheck } from "@tabler/icons-react";
import QuestionAction from "../Actions/QuestionAction";
import appStrings from "../../utils/strings";
import { useState } from "react";
import { removeWhiteSpace } from "../../utils/utils";

export default function EditableQuestionCard({
  data,
  onOk,
  onDelete,
  isEdit,
  onCancel,
  saveBtnLoading = false,
}) {
  const [isEditMode, setIsEditMode] = useState(isEdit || false);
  const [question, setQuestion] = useState(data);

  if (!isEditMode) {
    return (
      <Paper shadow="sm" withBorder p="lg">
        <Flex gap="md" direction="column">
          <Flex justify="space-between">
            <Title order={4}>{question.content}</Title>
            <Menu withinPortal shadow="md" position="top-end" width={150}>
              <Menu.Target>
                <ActionIcon variant="light" color="gray">
                  <IconDots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown p={5}>
                <QuestionAction
                  onEdit={() => setIsEditMode(true)}
                  onDelete={onDelete}
                />
              </Menu.Dropdown>
            </Menu>
          </Flex>
          <SimpleGrid cols={2} gap="md">
            {Object.entries(question.answer).map(([key, value], index) => (
              <Card key={key} shadow="xs" padding="md">
                <Flex align="center" gap="xs">
                  {question.correctAnswer.includes(index) ? (
                    <IconCheck size="1rem" color="green" />
                  ) : null}
                  {value}
                </Flex>
              </Card>
            ))}
          </SimpleGrid>
        </Flex>
      </Paper>
    );
  }
  return (
    <Fieldset variant="unstyled">
      <Flex gap="md" direction="column">
        <Flex gap="md">
          <Textarea
            placeholder={
              appStrings.language.questionBankDetail.questionContentLabel
            }
            value={question.content}
            onChange={(e) =>
              setQuestion({
                ...question,
                content: e.target.value,
              })
            }
            style={{ flex: 4 }}
          />
        </Flex>
        <SimpleGrid cols={2} gap="md">
          {Object.entries(question.answer).map(([key, value], index) => (
            <Flex key={index} align="center" gap="xs">
              <Checkbox
                checked={question.correctAnswer.includes(index)}
                onChange={(e) => {
                  setQuestion({
                    ...question,
                    correctAnswer: e.target.checked
                      ? [...question.correctAnswer, index]
                      : question.correctAnswer.filter((i) => i !== index),
                  });
                }}
              />
              <TextInput
                value={value}
                w="100%"
                placeholder={key}
                onChange={(e) => {
                  setQuestion({
                    ...question,
                    answer: {
                      ...question.answer,
                      [key]: e.target.value,
                    },
                  });
                }}
              />
            </Flex>
          ))}
        </SimpleGrid>
        <Flex justify="flex-end" gap="md">
          <Button
            variant="default"
            onClick={() => {
              onCancel && onCancel();
              setIsEditMode(false);
            }}
          >
            {appStrings.language.btn.cancel}
          </Button>
          <Button
            loading={saveBtnLoading}
            onClick={() => {
              onOk && onOk(question);
              setIsEditMode(false);
            }}
          >
            {appStrings.language.btn.save}
          </Button>
        </Flex>
      </Flex>
    </Fieldset>
  );
}
