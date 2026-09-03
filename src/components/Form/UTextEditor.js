"use client";

import { Controller } from "react-hook-form";
import { Form } from "antd";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function UTextEditor({ name, label, placeholder, value }) {
  return (
    <Controller
      name={name}
      defaultValue={value || ""}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          <JoditEditor
            value={field.value || ""}
            config={{
              height: 500,
              placeholder,
              uploader: {
                insertImageAsBase64URI: true,
              },
            }}
            onChange={(content) => {
              field.onChange(content);
            }}
          />
        </Form.Item>
      )}
    />
  );
}
