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

      <div className="flex justify-center items-center overflow-hidden mt-2">
        <div className="grid sm:grid-cols-2 gap-2 lg:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-center items-center">
          {[...Array(4)].map((_, index) => (
            <PostCardSkeleton key={index} size="small" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
