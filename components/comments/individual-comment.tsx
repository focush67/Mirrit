import React from "react";
import { User as UserData } from "@nextui-org/react";
import { Post } from "@prisma/client";
import { T_Comment } from "@/types/comment";
import DeleteComment from "../buttons/delete-comment";

interface IndividualCommentProps {
  comment: any;
  post: Post;
  loggedInUserId: string | undefined;
}

export default function IndividualComment({
  comment,
  post,
  loggedInUserId,
}: IndividualCommentProps) {
  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        <UserData
          name=""
          description=""
          avatarProps={{
            src: `${comment?.owner?.imageUrl}`,
          }}
        />
        <p>{comment?.content}</p>
      </div>

      {(loggedInUserId === post?.owner_Id ||
        comment?.commented_by_Id === loggedInUserId) && (
        <DeleteComment
          comment={comment}
          post={post}
          commentOwner={comment?.commentor?.id}
        />
      )}
    </div>
  );
}
