"use server";

import { db } from "@/utilities/database";
import { getSelf } from "@/services/auth-service";

export const LikePost = async (postId: string) => {
  const self = await getSelf();

  if (!self) {
    console.log("You need to login to like the post");
    return null;
  }

  const likeData = await db.like.create({
    data: {
      post_Id: postId,
      liked_by_Id: self.id,
    },
  });

  return likeData;
};

export const CommentOnPost = async ({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to login to comment on the post");
    return null;
  }

  const commentData = await db.comment.create({
    data: {
      commented_by_Id: self.id,
      content: content,
      post_Id: postId,
    },
  });

  return commentData;
};

export const deleteComment = async (commentId: string) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to login to delete a comment");
    return null;
  }

  const deletedComment = await db.comment.delete({
    where: {
      id: commentId,
    },
  });

  console.log({ deletedComment });
  return deletedComment;
};
