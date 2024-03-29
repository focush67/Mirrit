import { db } from "@/utilities/database";
import { getSelf } from "@/services/auth-service";

export const getPosts = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  return posts;
};

export const getCurrentUserPosts = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("No user is logged in to fetch current user posts");
    return null;
  }

  const posts = await db.post.findMany({
    where: {
      owner_Id: self?.id,
    },
    include: {
      owner: true,
    },
  });
  return posts;
};

export const getPostsByOwner = async (username: string) => {
  const posts = await db.post.findMany({
    where: {
      owner: {
        username: username,
      },
    },
    include: {
      owner: true,
    },
  });

  return posts;
};

export const getSavedPosts = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to login to delete the post");
    return null;
  }

  const savedPosts = await db.saved.findMany({
    where: {
      saved_by_Id: self.id,
    },
    include: {
      savedPost: {
        include: {
          owner: true,
        },
      },
    },
  });
  const filteredPosts = savedPosts.map((saved) => saved.savedPost);

  return filteredPosts;
};

export const getSavedPostsIds = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to login to delete the post");
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      id: self.id,
    },
    include: {
      savedPosts: true,
    },
  });

  if (!user) {
    console.log("No saved cluster");
    return null;
  }

  return user;
};
