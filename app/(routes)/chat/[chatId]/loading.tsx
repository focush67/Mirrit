"use client";

import { Avatar, Divider, Skeleton } from "@nextui-org/react";
import React from "react";

const LoadingChat = () => {
  return (
    <div>
      <div className="flex gap-x-2 space-y-1 items-center p-1">
        <Avatar src={""} size="md" />
        <h1>{""}</h1>
      </div>
      <Divider />
      <div className="pt-5">
        <ChatAreaSkeleton />
      </div>
      <div>
        <ChatInputSkeleton />
      </div>
    </div>
  );
};

export default LoadingChat;

export const ChatAreaSkeleton = () => {
  return (
    <div className="rounded-full">
      <Skeleton className="ml-2 h-[62vh] mr-2 rounded-md" />
    </div>
  );
};

export const ChatInputSkeleton = () => {
  return (
    <div className="px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-inset ring-1 ">
        <Skeleton className="h-20 w-full" />

        <div className="py-2" aria-hidden="true">
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Skeleton />
          </div>
        </div>
      </div>
    </div>
  );
};
