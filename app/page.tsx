"use client";

import PostCard from "@/components/post/post-card";
import SkeletonRender from "@/components/post/skeleton";
import { Post } from "@/types/post";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  fetchSaved,
  fetchUsers,
} from "@/redux_store/slices/async-thunks";
import { AppDispatch } from "@/redux_store/store";
import { useSession } from "next-auth/react";
import { selectAllPosts } from "@/redux_store/slices/posts/post-slice";
import { addNewUser } from "@/redux_store/slices/users/user-slice";
import axios from "axios";
import useFetchAllPosts from "@/custom_hooks/fetching_hooks/useFetchAllPosts";
import { useSocket } from "@/experiments/socket-context";

export default function Home() {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUsers());
    dispatch(fetchSaved(session?.user?.email!));
  }, [dispatch, session]);

  useEffect(() => {
    const registerUser = async () => {
      const response = await axios.post(`/api/register`, {
        email: session?.user?.email,
        userName: session?.user?.name,
        image: session?.user?.image,
      });

      if (response.data.status === 201) {
        dispatch(addNewUser(response.data.user));
      }
    };

    registerUser();
  }, [session]);

  useEffect(() => {
    console.log("Emmitting event");
    socket?.emit("add-new-user", {
      name: session?.user?.name,
      email: session?.user?.email,
      image: session?.user?.image,
      socketId: "",
    });
    return () => {
      console.log("Disabling socket event");
      socket?.off("add-new-user");
    };
  }, [socket, session]);

  const allPosts = useSelector(selectAllPosts);
  const { posts } = useFetchAllPosts();

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
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-3">
        {allPosts?.map((post: Post) => (
          <div
            className="m-2 lg:flex-row md:flex-row sm:flex-col"
            key={post._id}
          >
            <PostCard post={post} key={post._id} />
          </div>
        ))}
      </main>
    </>
  );
}
