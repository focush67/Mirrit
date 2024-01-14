"use client";

import PostCard from "@/components/post/post-card";
import useFetchUserSavedPosts from "@/custom_hooks/fetching_hooks/useFetchUserSavedPosts";
import { Post } from "@/types/post";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { GlobalState } from "@/types/state";
import { addAllSavedPosts } from "@/redux_store/slices/global-slices";

const SavedPage = () => {
  const { data: session } = useSession();
  const { savedPosts } = useFetchUserSavedPosts({
    email: session?.user?.email!,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (savedPosts && savedPosts.length > 0) {
      dispatch(addAllSavedPosts(savedPosts));
    }
  }, [session, savedPosts, dispatch]);

  const reduxSavedPosts = useSelector((state: GlobalState) => state.saved);
  console.log("Redux saved posts: ", reduxSavedPosts);

  console.log(savedPosts);
  return (
    <div className="flex flex-col items-center justify-center mt-2 gap-4">
      {reduxSavedPosts?.map((post: Post) => (
        <PostCard post={post} />
      ))}
    </div>
  );
};

export default SavedPage;
