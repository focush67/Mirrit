"use server";

import { Posts } from "@/models/post-schema";
import { Post } from "@/types/post";
import { Comment } from "@/types/comment";
import { getServerSession } from "next-auth";

export const deleteComment = async (
  commentId: string,
  post: Post,
  requestedBy: string
) => {
  const session = await getServerSession();
  console.log({ session });

  if (!session || session?.user?.email !== requestedBy) {
    throw new Error("Unauthorized");
  }

  const specificPost = await Posts.findById({ _id: post._id });

  specificPost.comments = specificPost.comments.filter(
    (comment: Comment) => String(comment._id) !== commentId
  );

  await specificPost.save();

  return specificPost;
};
