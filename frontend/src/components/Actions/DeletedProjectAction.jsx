import { Fragment } from "react";
import { Menu } from "@mantine/core";
import { IconRestore, IconTrash } from "@tabler/icons-react";
import appStrings from "../../utils/strings";

export default function DeleteProjectAction({ onRestoreTap, onPurgeTap }) {
  return (
    <Fragment>
      <Menu.Item
        leftSection={<IconRestore size="1rem" />}
        onClick={onRestoreTap}
      >
        {appStrings.language.trashProjects.restoreProjectBtn}
      </Menu.Item>
      <Menu.Item
        leftSection={<IconTrash size="1rem" />}
        c="red"
        onClick={onPurgeTap}
      >
        {appStrings.language.trashProjects.deletePermanentlyBtn}
      </Menu.Item>
    </Fragment>
  );
}
