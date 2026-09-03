"use client";

import Image from "next/image";

import { useRef, useState } from "react";
import { X, CirclePlus, Images, SendHorizontal, SmilePlus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Input } from "antd";
import userImage from "@/assets/images/user-avatar-lg.png";

export default function ChatContainer() {
  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imgPreviews, setImgPreviews] = useState([]);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative z-10 flex flex-col rounded-xl rounded-t-xl border bg-white px-2 py-6 lg:flex-row">
      <div className="flex flex-col justify-between lg:flex-grow lg:px-8">
        {/* Header */}
        <div className="flex-center-between border-b-primary-black/20 border-b pb-2">
          <div className="flex-center-start gap-x-4">
            <Image
              src={userImage}
              alt="United Threads logo"
              height={100}
              width={100}
              className="border-primary-black/20 aspect-square h-16 w-16 rounded-full border p-1"
            />
            <div>
              <h3 className="text-primary-black text-xl font-bold">Booxos</h3>
              <p className="text-muted-foreground text-sm font-medium">
                Online
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className="hide-scroll max-h-[65vh] min-h-[65vh] overflow-auto py-10"
          ref={chatBoxRef}
        >
          {/* Placeholder for messages */}
          <div className="flex-center min-h-[65vh] w-full gap-x-2 text-2xl font-bold">
            <CirclePlus />
            <p>Start a conversation</p>
          </div>
        </div>

        {/* Chat Input */}
        <div>
          {/* Image Preview */}
          {imgPreviews?.length > 0 && (
            <div className="border-b-none border-primary-black relative rounded-2xl border-x border-t p-2 lg:w-[89%]">
              <button
                className="absolute right-1 top-1 rounded-full bg-danger p-1 text-white"
                onClick={() => {
                  setImgPreviews([]);
                  fileInputRef.current.value = null;
                }}
              >
                <X size={16} />
              </button>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-7">
                {imgPreviews?.map((imgPreview, index) => (
                  <Image
                    key={index}
                    src={imgPreview}
                    alt="Image Preview"
                    height={250}
                    width={250}
                    className="h-[120px] w-auto rounded-2xl"
                  />
                ))}
              </div>
            </div>
          )}

          <form className="flex-center gap-x-4">
            {/* Message Input */}
            <div className="relative flex-grow">
              <Input
                placeholder="Type a message"
                type="text"
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 30,
                  paddingRight: 30,
                  borderRadius: 20,
                  border: "1px solid",
                }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border-none bg-blue-500 p-2.5 text-white shadow-none"
              >
                <SendHorizontal size={18} />
              </button>
            </div>

            {/* File Input */}
            <button
              type="button"
              className="rounded-full bg-slate-200 p-3"
              onClick={handleFileInputClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple={true}
                className="hidden"
                onChange={(e) => {
                  const files = [...e.target.files];
                  const previews = files.map((file) =>
                    URL.createObjectURL(file),
                  );
                  setImgPreviews(previews);
                }}
              />
              <Images size={20} />
            </button>

            {/* Emoji Picker */}
            <div className="relative">
              <button
                type="button"
                className="rounded-full bg-slate-200 p-3"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <SmilePlus size={20} />
              </button>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-16 right-0"
                >
                  <EmojiPicker />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
