"use server";

import { db } from "@/utilities/database";
import { getSelf } from "@/services/auth-service";
import { getUserById } from "@/services/user-service";
import { pusherServer } from "@/utilities/pusher";
import { removeTimeFields } from "@/utilities/remove-fields";

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

  const likeResponse = await db.like.findUnique({
    where: {
      id: likeData.id,
    },
    include: {
      liker: true,
      target_post: true,
    },
  });

  const targetPostOwner = await db.user.findUnique({
    where: {
      id: likeResponse?.target_post.owner_Id,
    },
  });

  console.log(
    `Sending like notification to channel ${targetPostOwner?.externalUserId} and user ${targetPostOwner?.username}`
  );

  const newNotif = await db.notification.create({
    data: {
      type: "like",
      senderId: self.id,
      receiverId: targetPostOwner?.id!,
      postId: postId,
    },
  });

  const like = await db.notification.findUnique({
    where: {
      id: newNotif.id,
    },
    include: {
      sender: true,
      receiver: true,
      post: true,
    },
  });

  pusherServer.trigger(
    `${targetPostOwner?.externalUserId}`,
    "like-notification",
    like
  );
  return likeResponse;
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

  const owner = await getUserById(commentData.commented_by_Id); // Who commented

  const postOwner = await db.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      owner: true,
    },
  });

  const commentResponse = {
    id: commentData.id,
    post_Id: commentData.post_Id,
    content: commentData.content,
    commented_by_Id: commentData.commented_by_Id,
    owner: removeTimeFields(owner),
  };

  console.log(
    `Sending comment notification to channel ${postOwner?.owner.externalUserId} and user ${postOwner?.owner.username}`
  );

  const newNotif = await db.notification.create({
    data: {
      type: "comment",
      senderId: commentData.commented_by_Id,
      receiverId: postOwner?.owner?.id!,
      postId: postId,
    },
  });

  const comment = await db.notification.findUnique({
    where: {
      id: newNotif.id,
    },
    include: {
      sender: true,
      receiver: true,
      post: true,
    },
  });

  await pusherServer.trigger(
    `${postOwner?.owner.externalUserId}`,
    `comment-notification`,
    comment
  );

  return commentResponse;
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
