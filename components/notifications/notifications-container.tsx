"use client";

import { NotificationContext } from "@/experiments/notification-context";
import { Post } from "@/types/post";
import { AuthProfile } from "@/types/profile";
import {
  Card,
  CardHeader,
  Avatar,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import React, { useContext } from "react";

// Import necessary modules

const Notification = () => {
  const { notifications } = useContext(NotificationContext) || {};
  console.log("Notifications: ", notifications);

  return (
    <div className="flex flex-col mt-2 justify-center">
      <span className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-center">
        Notifications
      </span>
      <div className="flex flex-col items-center ml-2 mr-2">
        {Array.from(notifications ?? [])?.map((notif, index) => (
          <NotificationCard
            post={notif.post}
            from={notif.from!}
            type={notif.type}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

const NotificationCard = ({
  post,
  type,
  from,
}: {
  post: Post;
  type: string;
  from: AuthProfile;
}) => {
  return (
    <Card
      key={post._id}
      className="w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] m-2 items-center justify-center pt-2"
    >
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Avatar isBordered radius="md" size="md" src={from?.image!} />
          <div className="flex flex-col items-start justify-center text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg">
            {type === "like" && <div>{from?.name} liked your post</div>}
            {type === "comment" && (
              <div>
                {from?.name} commented {} on your post
              </div>
            )}
          </div>
        </div>
        <Avatar isBordered radius="full" size="md" src={post.cover} />
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1"></div>
      </CardFooter>
    </Card>
  );
};

export default Notification;
