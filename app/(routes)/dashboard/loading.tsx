"use client";

import React from "react";
import { PostCardSkeleton } from "@/app/loading";
import ProfileSkeleton from "@/components/skeletons/profile-card";

export const DashboardLoading = () => {
  return (
    <div className="flex flex-col mt-1">
      <div className="flex justify-center items-center w-full mt-8">
        <ProfileSkeleton />
      </div>
      <div className="flex justify-center items-center overflow-hidden mt-2">
        <div className="grid sm:grid-cols-2 gap-2 md:grid-cols-3 lg:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-center items-center">
          {[...Array(4)].map((_, index) => (
            <PostCardSkeleton key={index} size="small" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
