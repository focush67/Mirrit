"use client";

import PostCard from "@/components/post/post-card";
import SkeletonRender from "@/components/post/skeleton";
import useFetchAllPosts from "@/custom_hooks/fetching_hooks/useFetchAllPosts";
import useFetchAllUsers from "@/custom_hooks/fetching_hooks/useFetchAllUsers";
import { addPostsChunk, resetPosts } from "@/redux_store/slices/global-slices";
import { addAllUsers } from "@/redux_store/slices/global-slices";
import { Post } from "@/types/post";
import { GlobalState } from "@/types/state";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const { posts } = useFetchAllPosts();
  const { users } = useFetchAllUsers();
  const dispatch = useDispatch();

  useEffect(() => {
    if (posts && posts.length > 0) {
      dispatch(addPostsChunk(posts));
    }

    if (users && users.length > 0) {
      dispatch(addAllUsers(users));
    }
    return () => {
      console.log("Resetting state");
      dispatch(resetPosts());
    };
  }, [posts, dispatch]);

  const allPosts = useSelector((state: GlobalState) => state.posts);
  console.log("Posts: ", allPosts);

  if (!posts || posts.length === 0) {
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
      {allPosts?.map((post: Post) => (
        <div className="m-2 lg:flex-row md:flex-row sm:flex-col">
          <PostCard post={post} key={post._id} />
        </div>
      ))}
    </main>
  );
}
