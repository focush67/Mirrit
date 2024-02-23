import { Post } from "@prisma/client";
import React, { memo } from "react";
import CommentSection from "../comments/comment-section";
import { T_Comment } from "@/types/comment";
import { getSelf } from "@/services/auth-service";

interface CommentProps {
  post: Post;
  existingComments: T_Comment[];
}

const CommentButton = async ({ post, existingComments }: CommentProps) => {
  const self = await getSelf();
  const loggedInUserId = self?.id;
  return (
    <CommentSection
      post={post}
      existingComments={existingComments}
      loggedInUserId={loggedInUserId}
    />
  );
};

export default memo(CommentButton);
