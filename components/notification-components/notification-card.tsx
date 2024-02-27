"use client";

import { NotificationsType } from "@/components/notification-components/notification-component";
import { distance } from "@/utilities/date-format";
import { Card, Avatar, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

interface NotificationCardProps {
  notification: NotificationsType;
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const dis = distance(notification);
  const router = useRouter();
  let cardStyle = "";

  switch (notification.type) {
    case "like":
      cardStyle = "bg-gray-100"; // Light background for like notifications
      break;
    case "comment":
      cardStyle = "bg-red-200"; // Light background for comment notifications
      break;
    case "follow":
      cardStyle = "bg-green-200"; // Light background for follow notifications
      break;
    default:
      cardStyle = "bg-gray-200"; // Default light background
      break;
  }
  return (
    <div className="w-full m-2">
      <Card
        shadow="lg"
        className={`group w-full ${cardStyle} cursor-pointer`}
        onClick={() => {
          if (notification.type !== "follow") {
            router.push(`/posts/${notification?.post?.id}`);
          }
        }}
      >
        <div className="flex items-start justify-between px-4 py-3">
          <div className="flex items-start gap-x-3">
            <Avatar
              size="sm"
              src={notification.sender?.imageUrl!}
              alt={notification.sender?.username}
              onClick={() => router.push(`/${notification.sender.username}`)}
            />
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-700">
                  {notification.sender?.username}
                </span>
                <span className="text-sm italic text-gray-500 ml-2">
                  {notification.type === "like"
                    ? "liked your post"
                    : notification.type === "comment"
                    ? "commented on your post"
                    : "started following you"}
                </span>
              </div>
              <div className="text-xs mt-1 text-gray-500">{dis}</div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image
              src={notification?.post?.cover}
              height={48}
              width={48}
              isZoomed
              onClick={() => router.push(`/posts/${notification.post?.id}`)}
              alt="post cover"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationCard;
