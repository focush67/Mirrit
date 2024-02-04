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
    <div className="flex flex-col mt-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ml-[30%] font-bold">
        Notifications
      </h1>
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
      key={post._id} // Assuming post has a unique identifier
      className="w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] m-2 items-center justify-center"
    >
      <CardHeader className="flex justify-between">
        <div className="flex gap-8 items-center justify-between w-full">
          <Avatar
            isBordered
            radius="md"
            size="md"
            src={from?.image!} // Make sure to adjust this based on your data structure
          />
          <div className="flex flex-col gap-1 items-start justify-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            {type === "like" && <div>{from?.name} liked your post</div>}
            {type === "comment" && (
              <div>{from?.name} commented on your post</div>
            )}
          </div>
          <div>
            <Avatar isBordered radius="full" size="md" src={post.cover} />
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1"></div>
      </CardFooter>
    </Card>
  );
};

export default Notification;
