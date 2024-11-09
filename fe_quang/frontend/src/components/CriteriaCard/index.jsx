import {
  Paper,
  Menu,
  Flex,
  Text,
  TextInput,
  NumberInput,
  ActionIcon,
  Badge,
  Fieldset,
  Button,
  Title,
} from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import CriteriaAction from "../Actions/CriteriaAction";
import appStrings from "../../utils/strings";
import { useState } from "react";
import { removeWhiteSpace } from "../../utils/utils";

export default function EditableCriteriaCard({
  data,
  onOk,
  onDelete,
  isEdit,
  onCancel,
  saveBtnLoading = false,
}) {
  const [isEditMode, setIsEditMode] = useState(isEdit || false);
  const [criteria, setCriteria] = useState(data);

  if (!isEditMode) {
    return (
      <Paper shadow="sm" withBorder p="lg">
        <Flex gap="md" direction="column">
          <Flex justify="space-between">
            <Title order={4}>{criteria.content}</Title>
            <Menu withinPortal shadow="md" position="top-end" width={150}>
              <Menu.Target>
                <ActionIcon variant="light" color="gray">
                  <IconDots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown p={5}>
                <CriteriaAction
                  onEdit={() => setIsEditMode(true)}
                  onDelete={onDelete}
                />
              </Menu.Dropdown>
            </Menu>
          </Flex>
          <Text>{criteria.example}</Text>
          <Badge variant="light" color="gray" size="sm" circle>
            {criteria.priority}
          </Badge>
        </Flex>
      </Paper>
    );
  }
  return (
    <Fieldset variant="unstyled">
      <Flex gap="md" direction="column">
        <Flex gap="md">
          <TextInput
            placeholder={appStrings.language.positionDetail.criteriaNameLabel}
            value={criteria.content}
            onChange={(e) =>
              setCriteria({
                ...criteria,
                content: removeWhiteSpace(e.target.value),
              })
            }
            style={{ flex: 4 }}
          />
          <NumberInput
            placeholder={
              appStrings.language.positionDetail.criteriaPriorityLabel
            }
            value={criteria.priority}
            onChange={(value) => setCriteria({ ...criteria, priority: value })}
            style={{ flex: 1 }}
            max={10}
            min={1}
          />
        </Flex>
        <TextInput
          placeholder={appStrings.language.positionDetail.criteriaExampleLabel}
          value={criteria.example}
          onChange={(e) =>
            setCriteria({ ...criteria, example: e.target.value })
          }
        />
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
              onOk && onOk(criteria);
              setIsEditMode(false);
            }}
            disabled={saveBtnLoading || !criteria.content || !criteria.example}
          >
            {appStrings.language.btn.save}
          </Button>
        </Flex>
      </Flex>
    </Fieldset>
  );
}
