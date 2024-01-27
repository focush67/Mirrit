"use client";

import PostCard from "@/components/post/post-card";
import SkeletonRender from "@/components/post/skeleton";
import {
  selectSavedCluster,
  selectSavedPosts,
} from "@/redux_store/slices/global-slices";
import { Post } from "@/types/post";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const SavedPage = () => {
  const savedCluster = useSelector(selectSavedCluster);
  const savedPosts = useSelector(selectSavedPosts);

  useEffect(() => {}, [savedCluster]);

  if (!savedPosts || savedPosts?.length === 0) {
    return (
      <div className="flex flex-col items-center h-screen justify-center">
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
      </div>
    );
  }

  return (
    <div className="flex mt-auto justify-center h-screen">
      <div className="lg:grid lg:grid-cols-4 md:grid-cols-2 sm:flex sm:flex-col items-center justify-center mt-2 gap-4">
        {savedPosts?.map((post: Post, index: number) => (
          <div className="mb-3" key={index}>
            <PostCard post={post} key={post._id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPage;
