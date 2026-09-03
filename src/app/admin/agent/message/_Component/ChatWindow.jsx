"use client";

import { useEffect, useRef } from "react";
import { Avatar, Spin } from "antd";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  chat,
  otherUser,
  messages,
  myUserId,
  loading,
  typingUser,
  onSend,
  onTyping,
  onStopTyping,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
        <Avatar size={44} src={otherUser?.profileAvatar}>
          {otherUser?.name?.[0]}
        </Avatar>
        <div>
          <p className="font-semibold text-slate-900">
            {otherUser?.name || "User"}
          </p>
          <p className="text-xs capitalize text-slate-400">
            {otherUser?.role || "customer"}
            {typingUser ? (
              <span className="ml-2 text-[#1B70A6]">typing…</span>
            ) : null}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 px-4 py-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spin />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-20 text-center text-sm text-slate-400">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((msg) => {
            const senderId =
              typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
            const isMine = senderId === myUserId;
            return (
              <MessageBubble key={msg._id} message={msg} isMine={isMine} />
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={onSend}
        onTyping={onTyping}
        onStopTyping={onStopTyping}
      />
    </>
  );
}
