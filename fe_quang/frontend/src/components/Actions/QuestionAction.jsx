import { Fragment } from "react";
import { Menu } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import appStrings from "../../utils/strings";

export default function QuestionAction({ onEdit, onDelete }) {
  return (
    <Fragment>
      <Menu.Item
        c="gray"
        leftSection={<IconEdit size="1rem" />}
        onClick={onEdit}
      >
        {appStrings.language.btn.edit}
      </Menu.Item>
      <Menu.Item
        c="red"
        leftSection={<IconTrash size="1rem" />}
        onClick={onDelete}
      >
        {appStrings.language.btn.delete}
      </Menu.Item>
    </Fragment>
  );
}
