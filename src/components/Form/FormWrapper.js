"use client";

import { Form } from "antd";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function FormWrapper({
  onSubmit,
  children,
  defaultValues,
  resolver,
}) {
  const formConfig = {};

  if (resolver) {
    formConfig["resolver"] = resolver;
  }

  // set default value-------------------------
  const methods = useForm(formConfig);

  useEffect(() => {
    if (defaultValues) {
      // Set default values after form is mounted
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  const handleSubmit = (data) => {
    onSubmit(data);
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <Form layout="vertical" onFinish={methods.handleSubmit(handleSubmit)}>
        {children}
      </Form>
    </FormProvider>
  );
}
