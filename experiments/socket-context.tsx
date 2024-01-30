"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

// Define the context
interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
});

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>(io("http://localhost:8080"));

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Define a custom hook to use the socket context
const useSocket = (): SocketContextProps => useContext(SocketContext);

export { SocketProvider, useSocket };
