"use client";

import { pusherClient } from "@/utilities/pusher";
import { useContext, useEffect, useState } from "react";
import NotificationCard from "@/components/notification-components/notification-card";
import { Post, User } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { NotificationContext } from "@/context/notification-context";
import { Divider } from "@nextui-org/react";

export interface NotificationsType {
  id: string;
  type: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  post: Post | null;
  createdAt: Date;
}

interface Props {
  notifications: NotificationsType[];
}

const Notifications = ({ notifications }: Props) => {
  const [currentNotifications, setCurrentNotifications] = useState<
    NotificationsType[]
  >([]);

  const { notificationCount, setNotificationCount } =
    useContext(NotificationContext) || {};

  const { user } = useUser();

  useEffect(() => {
    pusherClient.subscribe(`${user?.id}`);
    pusherClient.bind("like-notification", (data: NotificationsType) => {
      console.log(`like notification received from ${data.sender.username}`);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
        setNotificationCount?.((prev: number) => prev + 1);
        console.log("Count: ", notificationCount);
      }
    });
    pusherClient.bind("comment-notification", (data: NotificationsType) => {
      console.log(`comment notification received from ${data.sender.username}`);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
        setNotificationCount?.((prev: number) => prev + 1);
        console.log("Count: ", notificationCount);
      }
    });
    pusherClient.bind("follow-notification", (data: NotificationsType) => {
      console.log(`follow notification received from ${data.sender.username}`);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
        setNotificationCount?.((prev: number) => prev + 1);
        console.log("Count: ", notificationCount);
      }
    });
    return () => {
      pusherClient.unbind("comment-notification");
      pusherClient.unbind("like-notification");
      pusherClient.unbind("follow-notification");
      pusherClient.unsubscribe(`${user?.id}`);
    };
  }, [currentNotifications, user, notificationCount]);

  // Group notifications by their creation times
  const groupedNotifications: { [key: string]: NotificationsType[] } = {};
  notifications.forEach((notification) => {
    const dateKey = new Date(notification.createdAt)
      .toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
      })
      .toUpperCase(); // Convert date to uppercase
    if (!groupedNotifications[dateKey]) {
      groupedNotifications[dateKey] = [];
    }
    groupedNotifications[dateKey].push(notification);
  });

  return (
    <div className="flex flex-col md:items-start sm:items-center py-2">
      <h1 className="ml-2 text-xl font-semibold">Notifications</h1>
      <Divider className="mb-2" />
      {Object.entries(groupedNotifications)?.map(([dateKey, notifications]) => (
        <div key={dateKey} className="text-center mb-4">
          <h2 className="text-sm font-bold">{dateKey}</h2>
          {notifications.map((notification, index) => (
            <NotificationCard notification={notification} key={index} />
          ))}
        </div>
      ))}
      {/* Render current notifications */}
      <div className="h-[10vh] overflow-y-auto">
        {notifications.length === 0 && currentNotifications.length === 0 && (
          <div className="text-center text-gray-500">No notifications</div>
        )}
        {currentNotifications?.map((current, index) => (
          <NotificationCard key={index} notification={current} />
        ))}
      </div>
      <Divider />
    </div>
  );
};

export default Notifications;
