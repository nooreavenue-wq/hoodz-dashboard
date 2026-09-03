// hooks/useFileUpload.js
"use client";

import { useUploadFilesMutation } from "@/redux/api/uploadApi";
import { message } from "antd";

/**
 * Returns: { uploadFiles, uploading }
 * uploadFiles(fileList) → Promise<string[]>  (array of urls)
 */
export default function useFileUpload() {
  const [uploadMutation, { isLoading: uploading }] = useUploadFilesMutation();

  const uploadFiles = async (fileList) => {
    if (!fileList?.length) return [];

    const formData = new FormData();

    fileList.forEach((file) => {
      const raw = file.originFileObj || file;
      formData.append("files", raw); // API key = "files"
    });

    try {
      const res = await uploadMutation(formData).unwrap();
      // res.data = [{ url, size, extension, ... }]
      const urls = (res?.data || []).map((item) => item.url);
      return urls;
    } catch (error) {
      message.error(error?.data?.message || "File upload failed");
      throw error;
    }
  };

  /** Single file → single url */
  const uploadSingle = async (file) => {
    const urls = await uploadFiles([file]);
    return urls[0] || null;
  };

  return { uploadFiles, uploadSingle, uploading };
}
