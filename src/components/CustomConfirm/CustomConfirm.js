import { Popconfirm } from "antd";
import React from "react";

export default function CustomConfirm({
  children,
  title,
  description,
  onConfirm,
  okText = "Yes",
  cancelText = "No",
}) {
  return (
    <Popconfirm
      title={title || "Delete"}
      description={description || "Are you sure you want to do it?"}
      onConfirm={onConfirm}
      okText={okText}
      cancelText={cancelText}
    >
      {children}
    </Popconfirm>
  );
}
