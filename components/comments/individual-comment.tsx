"use client";

import React from "react";
import { User } from "@nextui-org/react";
import { Comment } from "@/types/comment";

interface IndividualCommentProps {
  comment: Comment;
}

export default function IndividualComment({ comment }: IndividualCommentProps) {
  return (
    <div className="flex items-center gap-2">
      <User
        name=""
        description=""
        avatarProps={{
          src: `${comment.image}`,
        }}
      />
      <p>{comment.content}</p>
    </div>
  );
}
