"use client";

import { Avatar } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function ChatListSidebar({
  chats,
  activeChatId,
  myUserId,
  onSelect,
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => {
        const other =
          chat.participants?.find((p) => p.user?._id !== myUserId)?.user ||
          chat.participants?.[0]?.user;

        const last = chat.lastMessage;
        const isActive = chat._id === activeChatId;
        const unread = last && !last.seen && last.sender?._id !== myUserId;

        return (
          <button
            key={chat._id}
            onClick={() => onSelect(chat._id)}
            className={`flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left transition ${
              isActive ? "bg-blue-50" : "hover:bg-slate-50"
            }`}
          >
            <div className="relative">
              <Avatar size={44} src={other?.profileAvatar}>
                {other?.name?.[0]}
              </Avatar>
              {unread && (
                <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-[#1B70A6] ring-2 ring-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`truncate text-sm ${
                    unread
                      ? "font-bold text-slate-900"
                      : "font-medium text-slate-800"
                  }`}
                >
                  {other?.name || "User"}
                </p>
                {last?.createdAt && (
                  <span className="shrink-0 text-[11px] text-slate-400">
                    {dayjs(last.createdAt).fromNow()}
                  </span>
                )}
              </div>
              <p
                className={`truncate text-xs ${
                  unread ? "font-medium text-slate-700" : "text-slate-400"
                }`}
              >
                {last?.text ||
                  (last?.files?.length ? "📎 Attachment" : "No messages yet")}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
