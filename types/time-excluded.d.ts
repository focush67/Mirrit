import { User, Post, Follow, Comment, Like, Saved } from "@prisma/client";

export type UserType = Omit<User, "createdAt" | "updatedAt">;
export type PostType = Omit<Post, "createdAt" | "updatedAt">;
export type FollowType = Omit<Follow, "createdAt" | "updatedAt">;
export type LikeType = Omt<Like, "createdAt" | "updatedAt">;
export type CommentType = Omit<Comment, "createdAt" | "updatetAt">;
export type SavedType = Omit<Saved, "createdAt" | "updatedAt">;
