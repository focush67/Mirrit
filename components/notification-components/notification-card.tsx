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

  return (
    <div className="w-auto m-2">
      <Card
        shadow="lg"
        className={`w-full bg-inherit cursor-pointer border-b border-white-1`}
        onClick={() => {
          if (notification.type !== "follow") {
            router.push(`/posts/${notification?.post?.id}`);
          }
        }}
      >
        <div className="flex items-start justify-between px-4 py-3">
          <div className="flex items-center gap-x-3 mr-4">
            <Avatar
              size="sm"
              src={notification.sender?.imageUrl!}
              alt={notification.sender?.username}
              onClick={() => router.push(`/${notification.sender.username}`)}
            />
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-medium text-xs text-gray-700">
                  {notification.sender?.username}
                </span>
                <span className="text-xs italic text-gray-500 ml-2">
                  {notification.type === "like"
                    ? "liked your post"
                    : notification.type === "comment"
                    ? "commented on post"
                    : "started following you"}
                </span>
              </div>
              <div className="text-xs mt-1 text-gray-500">{dis}</div>
            </div>
          </div>
          {notification?.type !== "follow" && (
            <div className="flex-shrink-0">
              <Image
                src={notification?.post?.cover}
                width={30}
                isZoomed
                onClick={() => router.push(`/posts/${notification.post?.id}`)}
                alt="post cover"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotificationCard;
