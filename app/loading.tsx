"use client";

import SkeletonRender from "@/components/post/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div>
      <SkeletonRender />
      <SkeletonRender />
      <SkeletonRender />
      <SkeletonRender />
      <SkeletonRender />
      <SkeletonRender />
      <SkeletonRender />
    </div>
  );
};

export default Loading;
