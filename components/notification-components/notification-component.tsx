"use client";

import { pusherClient, pusherServer } from "@/utilities/pusher";
import { useEffect, useState } from "react";
import NotificationCard from "@/components/notification-components/notification-card";
import { Post, User } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

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

  const { user } = useUser();
  console.log(user?.id);
  useEffect(() => {
    pusherClient.subscribe(`${user?.id}`);
    pusherClient.bind("like-notification", (data: NotificationsType) => {
      console.log("Like notification: ", data);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
      }
    });
    pusherClient.bind("comment-notification", (data: NotificationsType) => {
      console.log("Comment notification: ", data);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
      }
    });
    pusherClient.bind("follow-notification", (data: NotificationsType) => {
      console.log("Follow notification ", data);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
      }
    });
    return () => {
      pusherClient.unbind("comment-notification");
      pusherClient.unbind("like-notification");
      pusherClient.unbind("follow-notification");
      pusherClient.unsubscribe(`${user?.id}`);
    };
  }, [currentNotifications]);

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
