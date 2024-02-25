import React from "react";

import { Post } from "@prisma/client";
import DeleteComment from "../buttons/delete-comment";
import { User as UserData } from "@nextui-org/react";

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
          className="w-auto h-auto rounded-full"
          name=""
          description=""
          avatarProps={{
            src: `${comment?.owner?.imageUrl}`,
          }}
        />

        <p className="text-sm italic">{comment?.content}</p>
      </div>

      {(loggedInUserId === post?.owner_Id ||
        comment?.commented_by_Id === loggedInUserId) && (
        <div className="rounded-full">
          <DeleteComment
            comment={comment}
            post={post}
            commentOwner={comment?.commentor?.id}
          />
        </div>
      )}
    </div>
  );
}
