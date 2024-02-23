"use client";

import { Download, Loader2 } from "lucide-react";
import React, { useEffect, useTransition } from "react";
import { toast } from "react-hot-toast";
import { Post, User } from "@prisma/client";
import { savePost } from "@/server_actions/posts";
import { useDispatch } from "react-redux";
import {
  fetchPosts,
  fetchSaved,
  fetchUsers,
} from "@/redux_store/slices/async-thunks";
import { AppDispatch } from "@/redux_store/store";
import { addNewSavedPostState } from "@/redux_store/slices/saved/saved-slice";

interface SaveProps {
  post: Post;
  owner: User;
}

const ShareButton = ({ post, owner }: SaveProps) => {
  const [isPending, startTransition] = useTransition();
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUsers());
    dispatch(fetchSaved());
  }, []);

  const handleSavingPost = () => {
    startTransition(() => {
      savePost(post.id)
        .then((data) => {
          toast.success(`Post saved to Collections`);
          dispatch(
            addNewSavedPostState({
              postId: post.id,
              owner: owner,
            })
          );
        })
        .catch((error: any) => {
          toast.error("Already exists in cluster");
          console.log(error.message);
        });
    });
  };

  return (
    <div>
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Download className="hover:cursor-pointer" onClick={handleSavingPost} />
      )}
    </div>
  );
};

export default ShareButton;
