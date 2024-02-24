"use client";
import React from "react";
import {
  Skeleton,
  Card,
  Avatar,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
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
        <ProfileSkeleton />
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

export const ProfileSkeleton = () => {
  return (
    <div className="w-full flex justify-center md:justify-center mt-2">
      <Card className="w-full m-2 items-center shadow-2xl">
        <CardHeader className="flex justify-between items-center">
          <span className="flex gap-5 items-center justify-center">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2 items-start justify-between">
              <h4 className="text-xs font-semibold leading-none text-default-600"></h4>
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3 w-20 rounded-lg" />
                <Skeleton className="h-3 w-25 rounded-lg" />
              </div>
            </div>
          </span>
          <span className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-12 rounded-xl" />
          </span>
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <span className="pt-2"></span>
        </CardBody>
        <CardFooter className="gap-3">
          <Skeleton />
          <Skeleton />
        </CardFooter>
      </Card>
    </div>
  );
};
