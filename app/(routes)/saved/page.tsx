"use client";

import PostCard from "@/components/post/post-card";
import useFetchUserSavedPosts from "@/custom_hooks/fetching_hooks/useFetchUserSavedPosts";
import { Post } from "@/types/post";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { GlobalState } from "@/types/state";
import SkeletonRender from "@/components/post/skeleton";

const SavedPage = () => {
  const savedCluster = useSelector((state: GlobalState) => state.saved);

  const posts = useSelector((state: GlobalState) => state.posts);

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
      {filteredPosts?.map((post: Post) => (
        <PostCard post={post} key={post._id} />
      ))}
    </div>
  );
};

export default SavedPage;
