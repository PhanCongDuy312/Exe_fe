import { modals } from "@mantine/modals";
import appStrings from "../utils/strings";

export default function useConfirmModal({
  type,
  title,
  message,
  onCancel,
  onOk,
}) {
  const _title = title || appStrings.language.confirmModal.title;
  const _message = message || appStrings.language.confirmModal.message;
  // Get color of modal based on type
  let _color = null;
  if (type === "delete") {
    _color = "red";
  } else {
    _color = "blue";
  }
  function _trigger(...args) {
    return modals.openConfirmModal({
      title: title || _title,
      centered: true,
      children: message || _message,
      labels: {
        confirm: appStrings.language.confirmModal.confirm,
        cancel: appStrings.language.confirmModal.cancel,
      },
      confirmProps: { color: _color },
      onCancel: onCancel && (() => onCancel(...args)),
      onConfirm: onOk && (() => onOk(...args)),
    });
  }
  return _trigger;
}
