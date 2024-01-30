import { Post } from "@/types/post";
import React from "react";
import CommentSection from "../comments/comment-section";
import Hover from "../hover/hover-pop";
import { AuthProfile } from "@/types/profile";

interface CommentProps {
  post: Post;
  from: AuthProfile | null;
  to: AuthProfile | null;
}

const CommentButton = ({ post, from, to }: CommentProps) => {
  return (
    <Hover text="Comment">
      <CommentSection currentPost={post} from={from} to={to} />
    </Hover>
  );
};

export default CommentButton;
