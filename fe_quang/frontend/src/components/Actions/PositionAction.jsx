import { Fragment } from "react";
import { Menu } from "@mantine/core";
import { IconTrash, IconArchive, IconArchiveOff } from "@tabler/icons-react";
import appStrings from "../../utils/strings";

export default function PositionAction({
  isClose,
  onCloseTap,
  onOpenTap,
  onDeleteTap,
}) {
  return (
    <Fragment>
      <Menu.Item
        leftSection={
          isClose ? <IconArchiveOff size="1rem" /> : <IconArchive size="1rem" />
        }
        onClick={isClose ? onOpenTap : onCloseTap}
      >
        {isClose ? appStrings.language.btn.open : appStrings.language.btn.close}
      </Menu.Item>
      <Menu.Item
        c="red"
        leftSection={<IconTrash size="1rem" />}
        onClick={onDeleteTap}
      >
        {appStrings.language.btn.delete}
      </Menu.Item>
    </Fragment>
  );
}
