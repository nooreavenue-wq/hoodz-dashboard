"use client";

import { useRef, useState } from "react";
import { Button, Upload, Image } from "antd";
import { Paperclip, Send, X } from "lucide-react";
import useFileUpload from "@/hooks/useFileUpload";
import toast from "react-hot-toast";

export default function MessageInput({ onSend, onTyping, onStopTyping }) {
  const [text, setText] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previews, setPreviews] = useState([]);
  const typingTimeout = useRef(null);
  const { uploadFiles, uploading } = useFileUpload();

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping?.();
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      onStopTyping?.();
    }, 1200);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed && !fileList.length) return;

    try {
      let files = [];
      if (fileList.length) {
        files = await uploadFiles(fileList);
      }
      onSend?.(trimmed, files);
      setText("");
      setFileList([]);
      setPreviews([]);
      onStopTyping?.();
    } catch {
      toast.error("Failed to upload files");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-100 bg-white p-3">
      {previews.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {previews.map((url, i) => (
            <div key={i} className="relative">
              <Image
                src={url}
                alt="file"
                width={56}
                height={56}
                className="rounded object-cover"
              />
              <button
                type="button"
                className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                onClick={() => {
                  setFileList((p) => p.filter((_, idx) => idx !== i));
                  setPreviews((p) => p.filter((_, idx) => idx !== i));
                }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <Upload
          multiple
          fileList={fileList}
          beforeUpload={() => false}
          accept="image/*,.pdf"
          showUploadList={false}
          onChange={({ fileList: fl }) => {
            setFileList(fl);
            setPreviews(
              fl
                .filter((f) => f.originFileObj)
                .map((f) => URL.createObjectURL(f.originFileObj)),
            );
          }}
        >
          <Button
            type="text"
            icon={<Paperclip size={18} />}
            className="!text-slate-500"
          />
        </Upload>

        <textarea
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
          className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1B70A6]"
        />

        <Button
          type="primary"
          icon={<Send size={16} />}
          loading={uploading}
          onClick={handleSend}
          className="!h-[42px] !rounded-xl !bg-[#1B70A6]"
        />
      </div>
    </div>
  );
}
