"use client";

import { Image } from "antd";
import dayjs from "dayjs";

export default function MessageBubble({ message, isMine }) {
  const time = message.createdAt
    ? dayjs(message.createdAt).format("hh:mm A")
    : "";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3.5 py-2 shadow-sm ${
          isMine
            ? "rounded-br-md bg-[#1B70A6] text-white"
            : "rounded-bl-md bg-white text-slate-800"
        }`}
      >
        {message.text && (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.text}
          </p>
        )}

        {message.files?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {message.files.map((f, i) => (
              <Image
                key={i}
                alt="file"
                src={f}
                width={140}
                height={100}
                className="rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isMine ? "text-white/70" : "text-slate-400"
          }`}
        >
          {message.isEdited && <span>edited</span>}
          <span>{time}</span>
          {isMine && <span>{message.seen ? "✓✓" : "✓"}</span>}
        </div>
      </div>
    </div>
  );
}
