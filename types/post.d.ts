import { Like, Post, Saved, User, Comment } from "@prisma/client";
import { UserType } from "./user";
export type T_Post = {
  post: Post;
  postedBy: User;
};

export type PostType = Omit<Post, "createdAt" | "updatedAt">;

export type LikeType = Omit<Like, "createdAt" | "updatedAt">;

export type SavedType = Omit<Saved, "createdAt" | "updatedAt">;

type X = Omit<Comment, "createdAt" | "updatedAt">;

export type CommentType = X & { owner: UserType };
