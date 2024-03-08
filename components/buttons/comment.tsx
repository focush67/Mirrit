import { Post } from "@prisma/client";
import React, { memo } from "react";
import CommentSection from "../comments/comment-section";
import { getSelf } from "@/services/auth-service";

interface CommentProps {
  post: Post;
}

const CommentButton = async ({ post }: CommentProps) => {
  const self = await getSelf();
  const loggedInUserId = self?.id;
  return <CommentSection post={post} loggedInUserId={loggedInUserId} />;
};

export default memo(CommentButton);
