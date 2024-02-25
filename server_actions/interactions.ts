"use server";

import { db } from "@/utilities/database";
import { getSelf } from "@/services/auth-service";
import { getUserById } from "@/services/user-service";
import { UserType } from "@/types/user";

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

  const finalLikeData = (({ createdAt, updatedAt, ...rest }) => rest)(likeData);

  return finalLikeData;
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

  const owner = (await getUserById(commentData.commented_by_Id)) as UserType;

  const finalCommentData = (({ createdAt, updatedAt, ...rest }) => rest)(
    commentData
  );

  const combinedData = {
    owner: owner,
    ...finalCommentData,
  };

  return combinedData;

  /*
    type X = {
    id: string;
    post_Id: string;
    content: string;
    commented_by_Id: string;
}
  owner:{
    id: string;
    username: string;
    imageUrl: string | null;
    externalUserId: string;
    bio: string | null;
}
}
  */
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
  return deletedComment;
};
