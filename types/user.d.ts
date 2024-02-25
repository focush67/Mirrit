import { User, Follow } from "@prisma/client";

export type UserType = Omit<User, "createdAt" | "updatedAt">;

export type FollowType = Omit<Follow, "createdAt" | "updatedAt">;

export type StateUser = UserType & {
  followers: string[];
  followedProfiles: string[];
};
