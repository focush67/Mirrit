"use server";

import {
  FollowGivenUser,
  RemoveFollower,
  UnfollowGivenUser,
} from "@/services/follow-service";
import { revalidatePath } from "next/cache";

export const onFollow = async (id: string) => {
  try {
    const user = await FollowGivenUser(id);
    if (user) {
      revalidatePath(`/${user.following.username}`);
    }
    return user;
  } catch (error: any) {
    console.log("Error at onFollow ", error.message);
    throw new Error("Internal Server Error");
  }
};

export const onUnfollow = async (id: string) => {
  try {
    const user = await UnfollowGivenUser(id);
    if (user) {
      revalidatePath(`/following`);
    }
    return user;
  } catch (error: any) {
    console.log("Error at onUnfollow ", error.message);
    throw new Error("Internal Server Error");
  }
};

export const onRemoveFollower = async (id: string) => {
  try {
    const removedUser = await RemoveFollower(id);
    if (removedUser) {
      revalidatePath("/followers");
    }
    console.log(`revalidated /followers`);
    return removedUser;
  } catch (error: any) {
    console.log("Error at onRemoveFollower ", error.message);
    throw new Error("Internal Server ERROR");
  }
};
