"use client";

import SkeletonRender from "@/components/post/skeleton";
import React from "react";

const LoadingProfile = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <SkeletonRender />
      <SkeletonRender />
      <SkeletonRender />
      <SkeletonRender />
      <SkeletonRender />
    </div>
  );
};

export default LoadingProfile;
