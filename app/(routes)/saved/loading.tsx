"use client";
import { PostCardSkeleton } from "@/app/loading";
import React from "react";

const LoadingSaved = () => {
  return (
    <div className="flex gap-2 justify-center w-[90%]">
      {[...Array(3)].map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default LoadingSaved;
