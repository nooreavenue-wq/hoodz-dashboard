"use client";

import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Select, message, Image } from "antd";
import { Camera, Save, ImageIcon } from "lucide-react";
import { useUpdateProfileMutation } from "@/redux/api/profileApi";
import useFileUpload from "@/hooks/useFileUpload";
import LocationPicker from "./LocationPicker";
import toast from "react-hot-toast";

const countryOptions = [
  { label: "Bangladesh (+880)", value: "BN", dial: "+880" },
  { label: "Egypt (+20)", value: "EG", dial: "+20" },
  { label: "India (+91)", value: "IN", dial: "+91" },
  { label: "Saudi (+966)", value: "SA", dial: "+966" },
  { label: "UAE (+971)", value: "AE", dial: "+971" },
];

export default function ProfileInfoForm({ profile }) {
  const [form] = Form.useForm();
  const role = profile?.role;

  const [avatarFile, setAvatarFile] = useState([]);
  const [coverFile, setCoverFile] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(profile?.profileAvatar);
  const [coverPreview, setCoverPreview] = useState(profile?.coverPhoto);
  const [latLng, setLatLng] = useState({
    latitude: profile?.location?.coordinates?.[1] || null,
    longitude: profile?.location?.coordinates?.[0] || null,
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { uploadSingle, uploading } = useFileUpload();

  useEffect(() => {
    if (!profile) return;
    form.setFieldsValue({
      name: profile.name,
      address: profile.address,
      description: profile.description,
      countryCode: profile.countryCode || "BN",
      phone: profile.phone?.replace(/^\+\d+/, "") || profile.phone,
    });
    setAvatarPreview(profile.profileAvatar);
    setCoverPreview(profile.coverPhoto);
    setLatLng({
      latitude: profile.location?.coordinates?.[1] || null,
      longitude: profile.location?.coordinates?.[0] || null,
    });
  }, [profile, form]);

  const handleSubmit = async (values) => {
    try {
      let profileAvatar = profile.profileAvatar || null;
      let coverPhoto = profile.coverPhoto || null;

      if (avatarFile.length) {
        profileAvatar = await uploadSingle(avatarFile[0]);
      }
      if (coverFile.length && role === "vendor") {
        coverPhoto = await uploadSingle(coverFile[0]);
      }

      let payload = {};

      if (role === "admin" || role === "agent") {
        payload = {
          name: values.name?.trim(),
          address: values.address?.trim(),
          profileAvatar,
        };
      } else if (role === "vendor") {
        const selected = countryOptions.find(
          (c) => c.value === values.countryCode,
        );
        payload = {
          name: values.name?.trim(),
          profileAvatar,
          coverPhoto,
          description: values.description?.trim() || "",
          countryCode: values.countryCode,
          phone: `${selected?.dial || ""}${values.phone}`,
          address: values.address?.trim(),
          latitude: latLng.latitude,
          longitude: latLng.longitude,
          isProfileSetUp: true,
        };
      }

      const res = await updateProfile(payload).unwrap();
      toast.success(res?.message || "Profile updated");
      setAvatarFile([]);
      setCoverFile([]);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-3">
      {/* Left: photo cards */}
      <div className="space-y-4">
        {/* Avatar upload */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Profile Photo
          </p>
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Image
                src={
                  avatarPreview ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.name || "U",
                  )}&size=120&background=1B70A6&color=fff`
                }
                alt="avatar"
                className="h-24 w-24 rounded-full object-cover shadow ring-4 ring-white"
                width={120}
                height={120}
              />
              <Upload
                maxCount={1}
                fileList={avatarFile}
                beforeUpload={() => false}
                accept="image/*"
                showUploadList={false}
                onChange={({ fileList }) => {
                  setAvatarFile(fileList);
                  if (fileList[0]?.originFileObj) {
                    setAvatarPreview(
                      URL.createObjectURL(fileList[0].originFileObj),
                    );
                  }
                }}
              >
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#1B70A6] text-white shadow hover:bg-[#155a85]"
                >
                  <Camera size={14} />
                </button>
              </Upload>
            </div>
            <p className="text-xs text-slate-400">Click camera to change</p>
          </div>
        </div>

        {/* Cover upload — vendor */}
        {role === "vendor" && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Cover Photo
            </p>
            <div className="relative overflow-hidden rounded-xl">
              {coverPreview ? (
                <Image
                  height={200}
                  width={400}
                  src={coverPreview}
                  alt="cover"
                  className="h-28 w-full object-cover"
                />
              ) : (
                <div className="flex h-28 items-center justify-center bg-slate-200 text-slate-400">
                  <ImageIcon size={28} />
                </div>
              )}
              <Upload
                maxCount={1}
                fileList={coverFile}
                beforeUpload={() => false}
                accept="image/*"
                showUploadList={false}
                onChange={({ fileList }) => {
                  setCoverFile(fileList);
                  if (fileList[0]?.originFileObj) {
                    setCoverPreview(
                      URL.createObjectURL(fileList[0].originFileObj),
                    );
                  }
                }}
              >
                <button
                  type="button"
                  className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs text-white hover:bg-black/80"
                >
                  <Camera size={12} /> Change
                </button>
              </Upload>
            </div>
          </div>
        )}
      </div>

      {/* Right: form fields */}
      <div className="lg:col-span-2">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="rounded-2xl border border-slate-100 p-5 sm:p-6"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" className="!rounded-xl" />
          </Form.Item>

          <Form.Item label="Email">
            <Input
              size="large"
              value={profile?.email}
              disabled
              className="!rounded-xl"
            />
          </Form.Item>

          {role === "vendor" && (
            <>
              <Form.Item name="description" label="Shop Description">
                <Input.TextArea rows={3} className="!rounded-xl" />
              </Form.Item>

              <Form.Item label="Phone" required>
                <div className="flex gap-2">
                  <Form.Item name="countryCode" noStyle>
                    <Select
                      size="large"
                      className="!w-[160px]"
                      options={countryOptions.map((c) => ({
                        label: c.label,
                        value: c.value,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    noStyle
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input
                      size="large"
                      placeholder="1XXXXXXXXX"
                      className="!flex-1 !rounded-xl"
                    />
                  </Form.Item>
                </div>
              </Form.Item>
            </>
          )}

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" className="!rounded-xl" />
          </Form.Item>

          {role === "vendor" && (
            <Form.Item label="Shop Location">
              <LocationPicker
                latitude={latLng.latitude}
                longitude={latLng.longitude}
                onChange={({ lat, lng, address }) => {
                  setLatLng({ latitude: lat, longitude: lng });
                  if (address) form.setFieldValue("address", address);
                }}
              />
            </Form.Item>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<Save size={16} />}
            loading={uploading || isLoading}
            className="!h-11 !rounded-xl !px-8"
          >
            Save Changes
          </Button>
        </Form>
      </div>
    </div>
  );
}
