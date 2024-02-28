"use client";

import React, { ReactNode, createContext, useState } from "react";

interface NotificationContextProps {
  notificationCount: number;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}

export const NotificationContext = createContext<
  NotificationContextProps | undefined
>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  return (
    <NotificationContext.Provider
      value={{ notificationCount, setNotificationCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
