"use client";

import { Post } from "@prisma/client";
import React, { memo, useEffect, useTransition } from "react";
import { Heart, Loader } from "lucide-react";
import { LikePost } from "@/server_actions/interactions";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { likePost, selectPost } from "@/redux_store/slices/posts/post-slice";
import { StateType } from "@/redux_store/store";
import { useUser } from "@clerk/clerk-react";

interface LikeProps {
  post: Post;
  isDashboard?: true;
}

let LikeButton = ({ post, isDashboard }: LikeProps) => {
  const { isSignedIn } = useUser();

  const dispatch = useDispatch();
  const statePost = useSelector((state: StateType) =>
    selectPost(state, post.id)
  );
  const [isPending, startTransition] = useTransition();

  const onLike = () => {
    if (!isSignedIn) {
      toast.error("Please Login first");
      return;
    }
    startTransition(() => {
      LikePost(post.id)
        .then((data) => {
          toast.success("Liked Post");
          dispatch(
            likePost({
              postId: post.id,
              like: data!,
            })
          );
        })
        .catch((error) => {
          toast.error("Error liking post");
          console.log(error);
        });
    });
  };

  return (
    <div className="flex gap-2">
      {isPending ? (
        <Loader className="w-6 h-6 animate-spin" />
      ) : (
        <Heart className={` hover:cursor-pointer`} onClick={onLike} />
      )}
      <p>{statePost?.likes?.length}</p>
    </div>
  );
};

export default memo(LikeButton);
