"use client";
import { Card, Skeleton } from "@nextui-org/react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-2 space-y-2 mt-2">
      {[...Array(3)].map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
};
export default Loading;

export const PostCardSkeleton = () => {
  return (
    <Card
      className="py-2 flex flex-col w-[300px] h-[400px] relaitve shadow-2xl p-4"
      radius="lg"
    >
      <Skeleton className="rounded-xl h-8 mb-5" />

      <Skeleton className="rounded-lg h-full">
        <div className="h-24 rounded-lg bg-default-300"></div>
      </Skeleton>
      <div className="space-x-3 p-3 flex">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-5 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    </Card>
  );
};