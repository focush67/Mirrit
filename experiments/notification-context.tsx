"use client";

import { Post } from "@/types/post";
import { AuthProfile } from "@/types/profile";
import React, { createContext, useState } from "react";

interface Notification {
  post: Post;
  from: AuthProfile | null;
  type: "like" | "comment";
  to: AuthProfile | null;
}

interface NotificationContextProps {
  notifications: Set<Notification>;
  setNotifications: React.Dispatch<React.SetStateAction<Set<Notification>>>;
}

export const NotificationContext =
  createContext<NotificationContextProps | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Set<Notification>>(
    new Set()
  );

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
