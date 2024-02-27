"use client";
import { Card, Skeleton } from "@nextui-org/react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center mt-10 py-8">
      {[...Array(3)].map((_, index) => (
        <PostCardSkeleton key={index} size="large" />
      ))}
    </div>
  );
};

export default Loading;

export const PostCardSkeleton = ({ size }: { size: "small" | "large" }) => {
  return (
    <Card
      className={`py-2 px-2 flex flex-col ${
        size === "small" ? "w-[250px]" : "w-[300px]"
      } relaitve shadow-2xl h-[500px]`}
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
