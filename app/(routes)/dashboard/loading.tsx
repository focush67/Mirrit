"use client";
import SkeletonRender from "@/components/post/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center">
      <SkeletonRender />
    </div>
  );
};

export default loading;
