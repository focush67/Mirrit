"use server";

import { getSelf } from "@/services/auth-service";
import { T_Comment } from "@/types/comment";
import { db } from "@/utilities/database";
import { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getAllPosts = async () => {
  const posts = await db.post.findMany({
    include: {
      owner: true,
    },
  });
  return posts;
};

export const getCommentsForPost = async (postId: string) => {
  const comments = await db.comment.findMany({
    where: {
      post_Id: postId,
    },
    include: {
      commentor: true,
    },
  });

  const formattedComments: T_Comment[] = comments.map((comment) => ({
    commented_by_Id: comment.commented_by_Id,
    content: comment.content,
    commentor: comment.commentor,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    post_Id: comment.post_Id,
    id: comment.id,
  }));

  return formattedComments;
};

export const getLikesForPost = async (postId: string) => {
  const likes = await db.like.findMany({
    where: {
      post_Id: postId,
    },
    include: {
      liker: true,
    },
  });

  return likes;
};

export const getSavesForPost = async (postId: string) => {
  const saved = await db.saved.findMany({
    where: {
      saved_post_Id: postId,
    },
  });

  return saved;
};

export const createPost = async (post: Partial<Post>) => {
  const self = await getSelf();
  if (!self) {
    console.log(`You need to login to create a post`);
    return null;
  }
  const newPost = await db.post.create({
    data: {
      owner_Id: self.id,
      title: post.title!,
      description: post.description,
      cover: post.cover || "",
    },
  });
  console.log("Server action for post creation: ", newPost);
  revalidatePath("/dashboard");
  return newPost;
};

export const onEditPost = async (values: Partial<Post>) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to login to edit the post");
    return null;
  }

  const validData = {
    title: values.title,
    description: values.description,
  };

  const editedPost = await db.post.update({
    where: {
      id: values.id,
    },
    data: {
      ...validData,
    },
    include: {
      likes: true,
      comments: true,
      saved: true,
    },
  });
  revalidatePath("/dashboard");
  return editedPost;
};

export const deletePost = async (id: string) => {
  const self = await getSelf();
  if (!self) {
    console.log("Ypu need to login to delete the post");
    return null;
  }

  const deletedPost = await db.post.delete({
    where: {
      id: id,
    },
  });

  console.log("Server action for post deletion ", deletedPost);
  revalidatePath("/dashboard");
  return deletedPost;
};

export const savePost = async (saved_post_Id: string) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to save a post");
    return null;
  }
  const newSavedPost = await db.saved.create({
    data: {
      saved_by_Id: self.id,
      saved_post_Id: saved_post_Id,
    },
  });

  revalidatePath("/saved");

  return newSavedPost;
};

export const removeSavedPost = async (saved_post_Id: string) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to remove a saved post");
    return null;
  }

  const removePost = await db.saved.delete({
    where: {
      saved_by_Id_saved_post_Id: {
        saved_by_Id: self.id,
        saved_post_Id: saved_post_Id,
      },
    },
  });
  revalidatePath("/saved");

  console.log(`Server action for removing post `, removePost);
  return removePost;
};
