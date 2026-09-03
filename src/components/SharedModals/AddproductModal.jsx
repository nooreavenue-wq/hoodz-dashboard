"use client";

import { RiCloseLargeLine } from "react-icons/ri";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  Typography,
  Upload,
  message,
  Modal,
  Divider,
} from "antd";
import { PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
const { Title } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

const AddproductModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");

  const handleSubmit = (values) => {
    const formData = {
      ...values,
      description,
    };
    console.log("Form submitted:", formData);
    message.success("Product submitted successfully!");
    form.resetFields();
    setDescription("");
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => {
      console.log("File selected:", file.name);
      message.success(`${file.name} selected successfully.`);
      return false;
    },
    onDrop(e) {
      const files = Array.from(e.dataTransfer.files);
      console.log(
        "Dropped files:",
        files.map((f) => f.name),
      );
      message.success(`${files.length} file(s) dropped successfully.`);
    },
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        minWidth: "900px",
        position: "relative",
      }}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine
          size={18}
          color="black"
          className="absolute left-1/3 top-1/3"
        />
      </div>
      <h1 className="text-center text-2xl font-semibold">Add Product</h1>
      <Divider />
      <div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}
        >
          <Form.Item
            label="Product Title"
            name="productTitle"
            rules={[{ required: true, message: "Please enter product title" }]}
          >
            <Input className="h-12" placeholder="JBG Black Stone" />
          </Form.Item>

          <Form.Item
            label="Product Category"
            name="productCategory"
            rules={[
              { required: true, message: "Please select product category" },
            ]}
          >
            <Select className="!h-12" placeholder="Select">
              <Option value="electronics">Electronics</Option>
              <Option value="clothing">Clothing</Option>
              <Option value="furniture">Furniture</Option>
              <Option value="books">Books</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input className="h-12" placeholder="Enter" type="number" />
          </Form.Item>

          <Form.List
            name="shippingCharges"
            initialValue={[{ country: undefined, price: "" }]}
          >
            {(fields, { add, remove }) => (
              <div style={{ marginBottom: "24px" }}>
                <Title level={5}>Shipping Charge</Title>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: "8px" }}
                    align="baseline"
                  >
                    <Form.Item label="Country" name={[field.name, "country"]}>
                      <Select
                        className="!h-12"
                        placeholder="Select"
                        style={{ width: "240px" }}
                      >
                        <Option value="usa">USA</Option>
                        <Option value="uk">UK</Option>
                        <Option value="canada">Canada</Option>
                        <Option value="australia">Australia</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Price" name={[field.name, "price"]}>
                      <Input className="h-12" style={{ width: "120px" }} />
                    </Form.Item>
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    >
                      Delete
                    </Button>
                  </Space>
                ))}
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => add({ country: undefined, price: "" })}
                >
                  Add New
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item label="Description">
            {/* <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    style={{ height: "200px", marginBottom: "50px" }}
                /> */}
            <Input.TextArea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              style={{ height: "200px", marginBottom: "50px" }}
            />
          </Form.Item>

          <Form.List
            name="specifications"
            initialValue={[{ name: "", description: "" }]}
          >
            {(fields, { add, remove }) => (
              <div style={{ marginBottom: "24px" }}>
                <Title level={5}>Specification</Title>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: "8px" }}
                    align="baseline"
                  >
                    <Form.Item
                      label="Specification Name"
                      name={[field.name, "name"]}
                    >
                      <Input
                        className="h-12"
                        placeholder="Color"
                        style={{ width: "240px" }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Description"
                      name={[field.name, "description"]}
                    >
                      <Input
                        className="h-12"
                        placeholder="Black/White/Blue"
                        style={{ width: "240px" }}
                      />
                    </Form.Item>
                    {index > 0 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Space>
                ))}
                <Button
                  type="link"
                  onClick={() => add({ name: "", description: "" })}
                  style={{ padding: 0 }}
                >
                  + Add Another
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item label="Product Image">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Drag & Drop your photo here</p>
              <p className="ant-upload-hint">or Upload photo/s</p>
              <Button style={{ marginTop: "10px" }}>Choose File</Button>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", height: "40px", background: "#000" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddproductModal;
