import { Button, Upload } from "antd";
import { Form, Input } from "antd";
import { UploadCloud } from "lucide-react";
import { Controller } from "react-hook-form";

export default function UUpload({
  type,
  name,
  label,
  size,
  placeholder,
  defaultValue,
  disabled = false,
  labelStyles = {},
  className,
  suffix,
  style,
  max,
  required,
}) {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          name="teamLogo"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          rules={[
            {
              required: true,
              message: "Please upload player photo",
            },
          ]}
          style={{
            textAlign: "center",
            border: "2px dashed #D9D9D9",
            paddingBlock: "30px",
            borderRadius: "10px",
          }}
        >
          <Upload name="logo" listType="picture" maxCount={1}>
            <Button icon={<UploadCloud />}>Upload team logo</Button>
          </Upload>
        </Form.Item>
      )}
    />
  );
}
