"use client";

import { pusherClient, pusherServer } from "@/utilities/pusher";
import { useContext, useEffect, useState } from "react";
import NotificationCard from "@/components/notification-components/notification-card";
import { Post, User } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { NotificationContext } from "@/context/notification-context";

export interface NotificationsType {
  id: string;
  type: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  post: Post | null;
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
  return (
    <div className="flex flex-col items-center py-8 mt-10">
      <div>
        {notifications.map((notification, index) => {
          if (notification.type === "like") {
            return <NotificationCard notification={notification} key={index} />;
          } else {
            return <NotificationCard notification={notification} key={index} />;
          }
        })}

        <div className="mt-3 mb-1 flex flex-col items-center justify-center">
          <div>
            {currentNotifications?.map((current, index) => (
              <NotificationCard key={index} notification={current} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
