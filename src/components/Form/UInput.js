"use client";

import { Form, Input } from "antd";
import { Controller } from "react-hook-form";

const UInput = ({
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
          {type === "password" ? (
            <Input.Password
              {...field}
              type={type}
              id={name}
              size={size}
              placeholder={placeholder}
              className={`h-9 ${className}`}
            />
          ) : (
            <Input
              {...field}
              type={type}
              id={name}
              size={size}
              placeholder={placeholder}
              disabled={disabled}
              className={`h-9 ${className}`}
              suffix={suffix}
              style={style}
              max={max}
            />
          )}
        </Form.Item>
      )}
    />
  );
};

export default UInput;
