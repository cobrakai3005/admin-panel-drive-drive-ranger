import { Modal } from "antd";

export function confirmDelete({
  title = "Are you sure you want to delete?",
  content = "",
  okText = "Yes",
  cancelText = "Cancel",
  okType = "primary",
}) {
  return new Promise((resolve) => {
    Modal.confirm({
      title,
      content,
      okText,
      cancelText,
      okType,
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}
export function confirmUpdate({
  title = "Are you sure you want to Update this?",
  content = "",
  okText = "Yes",
  cancelText = "Cancel",
  okType = "primary",
}) {
  return new Promise((resolve) => {
    Modal.confirm({
      title,
      content,
      okText,
      cancelText,
      okType,
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}
export function confirmToggle({
  title = "Are you sure you want to Toggle this?",
  content = "",
  okText = "Yes",
  cancelText = "Cancel",
  okType = "primary",
}) {
  return new Promise((resolve) => {
    Modal.confirm({
      title,
      content,
      okText,
      cancelText,
      okType,
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}
