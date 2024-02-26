import { distance } from "@/utilities/date-format";
import { Card, Avatar, Image } from "@nextui-org/react";
import { Post, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

interface NotificationsType {
  id: string;
  type: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  post: Post | null;
}

interface NotificationCardProps {
  notification: NotificationsType;
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const dis = distance(notification);
  const router = useRouter();
  return (
    <div className="w-full m-2">
      <Card
        shadow="lg"
        className="group w-[70vw] hover:cursor-pointer hover:bg-gray-200"
        onClick={() => {
          if (notification.type !== "follow") {
            console.log("click");
            router.push(`/posts/${notification?.post?.id}`);
          } else {
            console.log("click");
          }
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-x-3">
            <Avatar
              size="md"
              src={notification.sender?.imageUrl!}
              alt={notification.sender?.username}
              onClick={() => router.push(`/${notification.sender.username}`)}
            />
            <div className="flex flex-col">
              <div className="flex gap-x-4 items-center">
                <span className="hidden sm:block md:block lg:block font-medium text-sm text-center text-gray-600">
                  {notification.sender?.username}
                </span>
                <span className="text-sm italic text-gray-600">
                  {notification.type === "like"
                    ? "liked your post"
                    : notification.type === "comment"
                    ? "commented on your post"
                    : "started following you"}
                </span>
              </div>

              <div className="text-xs mt-2 text-gray-500">{dis}</div>
            </div>
          </div>
          <Image
            src={notification?.post?.cover}
            width={42}
            height={40}
            isZoomed
            onClick={() => router.push(`/posts/${notification.post?.id}`)}
            alt="post cover"
          />
        </div>
      </Card>
    </div>
  );
};

export default NotificationCard;
