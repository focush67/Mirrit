"use client";

import PostCard from "@/components/post/post-card";
import SkeletonRender from "@/components/post/skeleton";
import { Post } from "@/types/post";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchUsers } from "@/redux_store/slices/async-thunks";
import { AppDispatch } from "@/redux_store/store";
import {
  addAllSavedPosts,
  selectAllPosts,
} from "@/redux_store/slices/global-slices";
import { useSession } from "next-auth/react";
import useFetchUserSavedPosts from "@/custom_hooks/fetching_hooks/useFetchUserSavedPosts";
import { useSocket } from "@/experiments/socket-context";
import { Socket, io } from "socket.io-client";
export default function Home() {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { relevantPosts, savedPostsCluster } = useFetchUserSavedPosts({
    email: session?.user?.email!,
  });

  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("add-new-user", (rsp) => {
      console.log("Connecion frontend: ", rsp);
    });
  }, [session, socket]);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUsers());

    if (savedPostsCluster && savedPostsCluster.length > 0) {
      dispatch(
        addAllSavedPosts({
          email: session?.user?.email!,
          postIds: savedPostsCluster,
        })
      );
    }

    socket?.emit("add-new-user", {
      name: session?.user?.name,
      email: session?.user?.email,
      image: session?.user?.image,
    });
  }, [dispatch, savedPostsCluster, session, socket]);

  const posts = useSelector(selectAllPosts);

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
          <PostCard post={post} key={index} />
        </div>
      ))}
    </main>
  );
}
