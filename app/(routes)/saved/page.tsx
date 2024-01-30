"use client";

import PostCard from "@/components/post/post-card";
import SkeletonRender from "@/components/post/skeleton";
import {
  removeSavedPost,
  selectSavedCluster,
  selectSavedPosts,
} from "@/redux_store/slices/global-slices";
import { Post } from "@/types/post";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const SavedPage = () => {
  const savedCluster = useSelector(selectSavedCluster);
  const savedPosts = useSelector(selectSavedPosts);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {}, [savedCluster]);

  if (!savedPosts || savedPosts?.length === 0) {
    return (
      <div className="flex flex-col items-center h-full justify-center">
        <h1 className="text-[30px] text-white font-bold ">
          Saved Posts appear here
        </h1>
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
        <SkeletonRender />
      </div>
    );
  }

  const handlePostRemovalFromSaved = async (post: Post) => {
    try {
      const response = await axios.delete(
        `/api/save/?email=${session?.user?.email}&_id=${post._id}`
      );

      console.log(response.data);
      if (response.data.status === 201) {
        dispatch(
          removeSavedPost({
            email: session?.user?.email!,
            postId: post._id,
          })
        );
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full mt-2 mb-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
        My Collection
      </h1>

      {savedPosts?.map((post: Post, index: number) => (
        <div key={index} className="mb-3">
          <PostCard
            post={post}
            key={post._id}
            remove={handlePostRemovalFromSaved}
          />
        </div>
      ))}
    </div>
  );
};

export default SavedPage;
