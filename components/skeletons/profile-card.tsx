"use client";
import React from "react";
import {
  Skeleton,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";

const ProfileSkeleton = () => {
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

export default ProfileSkeleton;
