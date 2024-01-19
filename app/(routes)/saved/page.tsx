"use client";

import PostCard from "@/components/post/post-card";
import { Post } from "@/types/post";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import SkeletonRender from "@/components/post/skeleton";
import {
  selectSavedCluster,
  selectSavedPosts,
} from "@/redux_store/slices/global-slices";

const SavedPage = () => {
  const savedCluster = useSelector(selectSavedCluster);

  const savedPosts = useSelector(selectSavedPosts);

  console.log({ savedCluster, savedPosts });

  useEffect(() => {}, [savedCluster]);

  if (!savedPosts || savedPosts?.length === 0) {
    return (
      <div className="flex flex-col items-center ">
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center mt-2 gap-4">
      <h1>My Collection</h1>
      {savedPosts?.map((post: Post) => (
        <PostCard post={post} key={post._id} />
      ))}
    </div>
  );
};

export default SavedPage;
