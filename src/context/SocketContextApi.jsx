"use client";

import { selectToken } from "@/redux/features/authSlice";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext({ socket: null, socketLoading: false });

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketLoading, setSocketLoading] = useState(false);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (!token) {
      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      return;
    }

    setSocketLoading(true);
    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token },
      autoConnect: true,
    });

    s.on("connect", () => {
      setSocketLoading(false);
      console.log("Socket connected:", s.id);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, socketLoading }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
