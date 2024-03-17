"use client";

import { Bookmark, Loader2 } from "lucide-react";
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
import { useUser } from "@clerk/nextjs";
import { removeTimeFields } from "@/utilities/remove-fields";

interface SaveProps {
  post: Post;
  owner: User;
}

const ShareButton = ({ post, owner }: SaveProps) => {
  const { isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUsers());
    dispatch(fetchSaved());
  }, [dispatch]);

  const handleSavingPost = () => {
    if (!isSignedIn) {
      toast.error("Please Login for saving");
      return;
    }
    startTransition(() => {
      savePost(post.id)
        .then((data) => {
          toast.success(`Post saved to Collections`);
          const timeFreeOwner = removeTimeFields(owner);
          dispatch(
            addNewSavedPostState({
              postId: post.id,
              owner: timeFreeOwner,
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
        <Bookmark className="hover:cursor-pointer" onClick={handleSavingPost} />
      )}
    </div>
  );
};

export default ShareButton;
