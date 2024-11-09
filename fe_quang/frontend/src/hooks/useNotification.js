import { notifications } from "@mantine/notifications";
import appStrings from "../utils/strings";

export default function useNotification({ type }) {
  // Get color of notification based on type
  let _color = null;
  if (type === "error") {
    _color = "red";
  } else if (type === "success") {
    _color = "green";
  } else if (type === "warning") {
    _color = "yellow";
  } else if (type === "info") {
    _color = "blue";
  } else {
    _color = "gray";
  }
  // Get title of notification based on type
  let _title = null;
  if (type === "error") {
    _title = appStrings.language.notification.error;
  } else if (type === "success") {
    _title = appStrings.language.notification.success;
  } else if (type === "warning") {
    _title = appStrings.language.notification.warning;
  } else if (type === "info") {
    _title = appStrings.language.notification.info;
  } else {
    _title = appStrings.language.notification.info;
  }
  // Create notification function
  function _notify({ title, message }) {
    notifications.show({
      title: title || _title,
      color: _color,
      message: message || "",
      timeout: 5000,
    });
  }
  return _notify;
}
