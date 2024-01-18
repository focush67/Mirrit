"use client";

import PostCard from "@/components/post/post-card";
import { Post } from "@/types/post";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import SkeletonRender from "@/components/post/skeleton";
import {
  selectAllPosts,
  selectSavedCluster,
} from "@/redux_store/slices/global-slices";

const SavedPage = () => {
  const savedCluster = useSelector(selectSavedCluster);

  const posts = useSelector(selectAllPosts);

  const filteredPosts = posts.filter((post: Post) =>
    savedCluster?.posts.includes(post._id)
  );

  console.log("Posts: ", { posts, savedCluster });
  console.log("Filtered Posts: ", filteredPosts);

  useEffect(() => {}, [posts, savedCluster]);

  if (!filteredPosts || filteredPosts?.length === 0) {
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
      {filteredPosts?.map((post: Post) => (
        <PostCard post={post} key={post._id} />
      ))}
    </div>
  );
};

export default SavedPage;
