"use client";
import { PostCardSkeleton } from "@/app/loading";
import React from "react";

const LoadingSaved = () => {
  return (
    <div className="flex gap-2 justify-center w-[90%] mt-6 py-6">
      {[...Array(3)].map((_, index) => (
        <PostCardSkeleton key={index} size="small" />
      ))}
    </div>
  );
};

export default LoadingSaved;
