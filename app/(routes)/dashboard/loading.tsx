"use client";
import React from "react";
import { Skeleton, Card } from "@nextui-org/react";
import { PostCardSkeleton } from "@/app/loading";

export const Loading = () => {
  return (
    <div className="p-4 w-full flex justify-start items-start md:justify-center ">
      <div className="w-[60%] flex items-center gap-3 justify-between">
        <div>
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const DashboardLoading = () => {
  return (
    <div className="flex flex-col space-y-6 ">
      <div className="w-full flex justify-start sm:justify-center mt-2 h-auto">
        <Card className="w-full m-2" radius="lg">
          <Loading />
        </Card>
      </div>

      <div className="flex gap-2 justify-center ml-2 mr-2">
        {[...Array(3)].map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default DashboardLoading;
