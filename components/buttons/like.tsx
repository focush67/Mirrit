"use client";

import { Post } from "@/types/post";
import React, { useCallback } from "react";
import Hover from "../hover/hover-pop";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { likePost } from "@/redux_store/slices/posts/post-slice";
import { useSession } from "next-auth/react";
import { AuthProfile } from "@/types/profile";

interface LikeProps {
  post: Post;
  from: AuthProfile | null;
  to: AuthProfile | null;
}

const LikeButton = ({ post, from, to }: LikeProps) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const handleLikeMemo = useCallback(async () => {
    try {
      if (!session) {
        toast.error("Requires Login for Liking");
        return;
      }
      const response = await axios.post(`/api/posts/like/?id=${post._id}`);
      dispatch(likePost({ _id: post._id }));
      toast.success("Liked");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Some error occured");
    }
  }, [post, session, dispatch]);

  return (
    <Hover text="Like">
      <Heart className="hover:cursor-pointer" onClick={handleLikeMemo} />
      <p>{post.likes}</p>
    </Hover>
  );
};

export default LikeButton;
