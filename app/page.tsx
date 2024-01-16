"use client";

import PostCard from "@/components/post/post-card";
import SkeletonRender from "@/components/post/skeleton";
import useFetchAllPosts from "@/custom_hooks/fetching_hooks/useFetchAllPosts";
import useFetchAllUsers from "@/custom_hooks/fetching_hooks/useFetchAllUsers";
import useFetchUserSavedPosts from "@/custom_hooks/fetching_hooks/useFetchUserSavedPosts";
import {
  addAllSavedPosts,
  addPostsChunk,
} from "@/redux_store/slices/global-slices";
import { addAllUsers } from "@/redux_store/slices/global-slices";
import { Post } from "@/types/post";
import { GlobalState } from "@/types/state";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";

export default function Home() {
  const dispatch = useDispatch();

  const { data: session } = useSession();
  const { posts } = useFetchAllPosts();
  const { users } = useFetchAllUsers();
  const { savedPostsCluster } = useFetchUserSavedPosts({
    email: session?.user?.email!,
  });

  useEffect(() => {
    if (posts && posts.length > 0) {
      dispatch(addPostsChunk(posts));
    }

    if (savedPostsCluster && savedPostsCluster.length > 0) {
      dispatch(
        addAllSavedPosts({
          email: session?.user?.email!,
          postIds: savedPostsCluster,
        })
      );

      if (users && users.length > 0) {
        dispatch(addAllUsers(users));
      }
    }
  }, [posts, dispatch, savedPostsCluster, session]);

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
      {allPosts?.map((post: Post, index: number) => (
        <div className="m-2 lg:flex-row md:flex-row sm:flex-col" key={index}>
          <PostCard post={post} key={post._id} />
        </div>
      ))}
    </main>
  );
}
