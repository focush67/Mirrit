import { Post } from "@/types/post";
import React from "react";
import CommentSection from "../comments/comment-section";

import { AuthProfile } from "@/types/profile";

interface CommentProps {
  post: Post;
  from: AuthProfile | null;
  to: AuthProfile | null;
}

const CommentButton = ({ post, from, to }: CommentProps) => {
  return <CommentSection currentPost={post} from={from} to={to} />;
};

export default CommentButton;
