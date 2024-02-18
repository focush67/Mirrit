"use client";

import React, { ReactNode, createContext, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the context
interface SocketContextProps {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextProps>({
  socket: null,
});

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>(io("http://localhost:4000"));

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Define a custom hook to use the socket context
const useSocket = (): SocketContextProps => useContext(SocketContext);

export { SocketProvider, useSocket };
