"use client";
import {Button, Divider, Form, Modal, Select, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

import {RiCloseLargeLine} from "react-icons/ri";
import {useState} from "react";

const AddbannerModal = ({open, setOpen}) => {
     const [form] = Form.useForm();

     const [loading, setLoading] = useState(false);

     const handleSubmit = (values) => {
          console.log("Form Values:", values);
          setOpen(false);
          form.resetFields();
     };

     const beforeUpload = (file) => {
          const isJpgOrPng =
               file.type === "image/jpeg" || file.type === "image/png";
          if (!isJpgOrPng) {
               alert("You can only upload JPG/PNG files!");
               return Upload.LIST_IGNORE;
          }
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
               alert("Image must be smaller than 2MB!");
               return Upload.LIST_IGNORE;
          }
          return false;
     };

     const onSearch = (value) => {
          console.log("search:", value);
     };

     return (
          <Modal
               open={open}
               footer={null}
               centered
               onCancel={() => setOpen(false)}
               closeIcon={false}
               style={{
                    minWidth: "max-content",
                    position: "relative",
               }}>
               {/* Close Icon */}
               <div
                    className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl "
                    onClick={() => setOpen(false)}>
                    <RiCloseLargeLine
                         size={18}
                         color="black"
                         className="absolute left-1/3 top-1/3"
                    />
               </div>

               <div className="pb-5">
                    <h4 className="text-center text-2xl font-medium">
                         Add Banner
                    </h4>
                    <Divider />
                    <div className="flex-1">
                         <Form
                              form={form}
                              onFinish={handleSubmit}
                              layout="vertical"
                              initialValues={{
                                   category: "",
                              }}
                              style={{
                                   maxWidth: 500,
                                   marginTop: "25px",
                              }}>
                              {/* Image Upload */}
                              <Form.Item
                                   name="bannerImage"
                                   valuePropName="fileList"
                                   getValueFromEvent={(e) =>
                                        Array.isArray(e) ? e : e && e.fileList
                                   }
                                   rules={[
                                        {
                                             required: true,
                                             message: "Please upload a banner image",
                                        },
                                   ]}
                                   style={{
                                        textAlign: "center",
                                        border: "2px dashed #B87CAE",
                                        paddingBlock: "20px",
                                        borderRadius: "10px",
                                   }}>
                                   <Upload
                                        name="imageBanner"
                                        listType="picture"
                                        beforeUpload={beforeUpload}>
                                        <Button icon={<UploadOutlined />}>
                                             Upload Banner Image
                                        </Button>
                                   </Upload>
                              </Form.Item>

                              {/* Category Field */}

                              <Form.Item
                                   label="Category"
                                   name="category"
                                   rules={[
                                        {
                                             required: true,
                                             message: "Please enter category",
                                        },
                                   ]}>
                                   <Select
                                        size="large"
                                        placeholder="Enter category"
                                        onSearch={onSearch}
                                        options={[
                                             {
                                                  value: "jack",
                                                  label: "Jack",
                                             },
                                             {
                                                  value: "lucy",
                                                  label: "Lucy",
                                             },
                                             {
                                                  value: "tom",
                                                  label: "Tom",
                                             },
                                        ]}></Select>
                              </Form.Item>

                              {/* Submit Button */}
                              <Button
                                   htmlType="submit"
                                   size="large"
                                   block
                                   loading={loading}
                                   style={{
                                        backgroundColor: "#5E7BFC",
                                        color: "white",
                                        marginTop: "20px",
                                   }}>
                                   Upload
                              </Button>
                         </Form>
                    </div>
               </div>
          </Modal>
     );
};

export default AddbannerModal;
