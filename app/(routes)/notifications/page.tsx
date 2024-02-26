"use client";

import { pusherClient } from "@/utilities/pusher";
import { useEffect, useState } from "react";
import NotificationCard from "@/components/notification-components/notification-card";
import { Post, User } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface NotificationsType {
  id: string;
  type: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  post: Post | null;
}

interface NotificationProps {
  notifications: NotificationsType[];
}

const Notifications = ({ notifications }: NotificationProps) => {
  const [currentNotifications, setCurrentNotifications] = useState<
    NotificationsType[]
  >([]);

  const router = useRouter();
  const { user } = useUser();
  if (!user) {
    router.push("/");
    return;
  }

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
    <div className="flex flex-col items-center">
      <div>
        {notifications.map((notification, index) => {
          if (notification.type === "like") {
            return <NotificationCard notification={notification} key={index} />;
          } else {
            return <NotificationCard notification={notification} key={index} />;
          }
        })}

        <div className="mt-3 mb-1 flex flex-col items-center justify-center">
          <h1>Recents</h1>
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
