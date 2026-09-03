"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Spin, Empty, Input } from "antd";
import { Search, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";
import { jwtDecode } from "jwt-decode";
import ChatListSidebar from "./ChatListSidebar";
import ChatWindow from "./ChatWindow";
import { useSocket } from "@/context/SocketContextApi";
import {
  useGetChatListQuery,
  useGetMessageByChatIdQuery,
} from "@/redux/api/messageApi";

export default function ChatContainer() {
  const { socket } = useSocket();
  const token = useSelector(selectToken);

  const myUserId = useMemo(() => {
    try {
      return token ? jwtDecode(token)?.userId : null;
    } catch {
      return null;
    }
  }, [token]);

  const [searchText, setSearchText] = useState("");
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  // Initial HTTP load
  const { data: listRes, isLoading: listLoading } = useGetChatListQuery({
    page: 1,
    limit: 50,
    searchText,
  });

  const {
    data: msgRes,
    isLoading: msgLoading,
    isFetching: msgFetching,
  } = useGetMessageByChatIdQuery(activeChatId, {
    skip: !activeChatId,
  });

  // Sync HTTP chat list → only customer_support
  useEffect(() => {
    const list = listRes?.data?.customer_support || [];
    setChatList(list);
  }, [listRes]);

  // Sync HTTP messages when opening a chat
  useEffect(() => {
    if (!activeChatId || !msgRes?.data) return;
    setMessages(msgRes.data);
  }, [msgRes, activeChatId]);

  // Mark seen when opening chat
  useEffect(() => {
    if (!socket || !activeChatId) return;
    socket.emit("chat:seen", { chatId: activeChatId });
  }, [socket, activeChatId]);

  // ---- Socket listeners ----
  useEffect(() => {
    if (!socket) return;

    const onList = (payload) => {
      // payload may be full object or { customer_support: [...] }
      const list =
        payload?.customer_support ||
        payload?.data?.customer_support ||
        (Array.isArray(payload) ? payload : null);
      if (list) setChatList(list);
    };

    const onNewMessage = (message) => {
      // Update messages if this chat is open
      if (message?.chat === activeChatId || message?.chatId === activeChatId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
        // mark seen
        socket.emit("chat:seen", { chatId: activeChatId });
      }

      // Update lastMessage in list optimistically
      setChatList((prev) => {
        const chatId = message?.chat || message?.chatId;
        const idx = prev.findIndex((c) => c._id === chatId);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          lastMessage: {
            _id: message._id,
            text: message.text,
            files: message.files || [],
            seen: message.seen,
            isEdited: message.isEdited,
            sender: message.sender,
            createdAt: message.createdAt,
          },
        };
        // move to top
        const [item] = next.splice(idx, 1);
        return [item, ...next];
      });
    };

    const onMessageUpdated = (message) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? { ...m, ...message } : m)),
      );
    };

    const onMessageDeleted = (data) => {
      setMessages((prev) => prev.filter((m) => m._id !== data.messageId));
    };

    const onSeen = (data) => {
      if (data?.chatId !== activeChatId) return;
      setMessages((prev) => prev.map((m) => ({ ...m, seen: true })));
    };

    const onTyping = (data) => {
      if (data?.chatId !== activeChatId) return;
      if (data?.userId === myUserId) return;
      setTypingUser(data);
    };

    const onStopTyping = (data) => {
      if (data?.chatId !== activeChatId) return;
      setTypingUser(null);
    };

    socket.on("chat:list", onList);
    socket.on("chat:new-message", onNewMessage);
    socket.on("chat:message-updated", onMessageUpdated);
    socket.on("chat:message-deleted", onMessageDeleted);
    socket.on("chat:seen", onSeen);
    socket.on("chat:typing", onTyping);
    socket.on("chat:stop-typing", onStopTyping);

    // refresh list once connected
    socket.emit("chat:my-list", {});

    return () => {
      socket.off("chat:list", onList);
      socket.off("chat:new-message", onNewMessage);
      socket.off("chat:message-updated", onMessageUpdated);
      socket.off("chat:message-deleted", onMessageDeleted);
      socket.off("chat:seen", onSeen);
      socket.off("chat:typing", onTyping);
      socket.off("chat:stop-typing", onStopTyping);
    };
  }, [socket, activeChatId, myUserId]);

  const activeChat = chatList.find((c) => c._id === activeChatId) || null;

  const otherUser = useMemo(() => {
    if (!activeChat) return null;
    const parts = activeChat.participants || [];
    const other = parts.find((p) => p.user?._id !== myUserId);
    return other?.user || parts[0]?.user || null;
  }, [activeChat, myUserId]);

  const handleSend = useCallback(
    (text, files = []) => {
      if (!socket || !activeChatId) return;
      if (!text?.trim() && !files.length) return;

      socket.emit(
        "chat:send-message",
        { chatId: activeChatId, text: text?.trim() || "", files },
        (ack) => {
          if (ack && ack.success === false) {
            console.error("send failed", ack);
          }
          // new message will arrive via chat:new-message
        },
      );
      socket.emit("chat:stop-typing", { chatId: activeChatId });
    },
    [socket, activeChatId],
  );

  const handleTyping = useCallback(() => {
    if (!socket || !activeChatId) return;
    socket.emit("chat:typing", { chatId: activeChatId });
  }, [socket, activeChatId]);

  const handleStopTyping = useCallback(() => {
    if (!socket || !activeChatId) return;
    socket.emit("chat:stop-typing", { chatId: activeChatId });
  }, [socket, activeChatId]);

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Sidebar */}
      <div className="flex w-full max-w-[340px] flex-col border-r border-slate-100">
        <div className="border-b border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-2">
            <MessageCircle className="text-[#1B70A6]" size={22} />
            <h2 className="text-lg font-semibold">Customer Support</h2>
          </div>
          <Input
            placeholder="Search chats..."
            prefix={<Search size={16} className="text-slate-400" />}
            className="!rounded-xl"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {listLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spin />
          </div>
        ) : chatList.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Empty description="No chats" />
          </div>
        ) : (
          <ChatListSidebar
            chats={chatList}
            activeChatId={activeChatId}
            myUserId={myUserId}
            onSelect={setActiveChatId}
          />
        )}
      </div>

      {/* Window */}
      <div className="flex min-w-0 flex-1 flex-col">
        {!activeChatId ? (
          <div className="flex flex-1 flex-col items-center justify-center text-slate-400">
            <MessageCircle size={48} className="mb-3 opacity-40" />
            <p>Select a conversation</p>
          </div>
        ) : (
          <ChatWindow
            chat={activeChat}
            otherUser={otherUser}
            messages={messages}
            myUserId={myUserId}
            loading={msgLoading || msgFetching}
            typingUser={typingUser}
            onSend={handleSend}
            onTyping={handleTyping}
            onStopTyping={handleStopTyping}
          />
        )}
      </div>
    </div>
  );
}
