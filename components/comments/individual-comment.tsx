import React from "react";
import { User } from "@nextui-org/react";
import { Comment } from "@/types/comment";
import { Post } from "@/types/post";
import DeleteComment from "../buttons/delete-comment";

interface IndividualCommentProps {
  comment: Comment;
  post: Post;
  requestedBy: string;
}

export default function IndividualComment({
  comment,
  post,
  requestedBy,
}: IndividualCommentProps) {
  const isCommentOnOthersPost = comment.user_email === requestedBy;
  const isOwnPost = post.email === requestedBy;
  return (
    <div className="flex items-center gap-2 justify-between">
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

      {(isCommentOnOthersPost || isOwnPost) && (
        <DeleteComment
          requestedBy={requestedBy}
          commentId={comment._id}
          post={post}
        />
      )}
    </div>
  );
}
