"use client";

import PostCard from "@/components/post/post-card";
import SkeletonRender from "@/components/post/skeleton";
import { Post } from "@/types/post";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCluster,
  fetchPosts,
  fetchUsers,
} from "@/redux_store/slices/async-thunks";
import { AppDispatch } from "@/redux_store/store";
import {
  selectAllPosts,
  selectAllUsers,
  selectSavedCluster,
} from "@/redux_store/slices/global-slices";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("dispatching");
    dispatch(fetchPosts());
    dispatch(fetchUsers());
    dispatch(fetchCluster());
  }, [dispatch]);

  const posts = useSelector(selectAllPosts);

  const users = useSelector(selectAllUsers);

  const cluster = useSelector(selectSavedCluster);

  console.log({ posts, users, cluster });

  if (!posts || posts?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-3">
      {posts?.map((post: Post, index: number) => (
        <div className="m-2 lg:flex-row md:flex-row sm:flex-col" key={index}>
          <PostCard post={post} key={post._id} />
        </div>
      ))}
    </main>
  );
}
