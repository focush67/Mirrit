"use client";

import PostCard from "@/components/post/post-card";
import SkeletonRender from "@/components/post/skeleton";
import {
  addAllSavedPosts,
  addPostsChunk,
} from "@/redux_store/slices/global-slices";
import { addAllUsers } from "@/redux_store/slices/global-slices";
import { Post } from "@/types/post";
import { GlobalState, SavedPosts } from "@/types/state";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/types/profile";
import { fetchPosts, fetchUsers } from "@/redux_store/slices/async-thunks";
import { AppDispatch } from "@/redux_store/store";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: GlobalState) => state.posts);

  const users = useSelector((state: GlobalState) => state.users);

  const cluster = useSelector((state: GlobalState) => state.saved);

  useEffect(() => {
    console.log("dispatching");
    dispatch(fetchPosts());
    dispatch(fetchUsers());
  }, [dispatch]);

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
