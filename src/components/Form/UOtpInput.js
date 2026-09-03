"use client";

import { Form, Input } from "antd";
import { Controller } from "react-hook-form";

const UOtpInput = ({
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
}) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
        className="otp-input !w-full"
          label={
            Object.keys(labelStyles)?.length > 0 ? (
              <label style={labelStyles}>{label}</label>
            ) : (
              label
            )
          }
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          <Input.OTP size="large" {...field} />
        </Form.Item>
      )}
    />
  );
};

export default UOtpInput;
