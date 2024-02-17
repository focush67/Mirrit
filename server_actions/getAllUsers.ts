"use server";

import { Profiles } from "@/models/user-profile-schema";
import { UserProfile } from "@/types/profile";

export default async function getAllUsers() {
  try {
    const users: UserProfile[] = await Profiles.find();
    if (!users) {
      console.log("No User Profiles found, returning null");
      return null;
    }

    return users as UserProfile[];
  } catch (error: any) {
    console.log("Error at server action getAllUsers()");
    console.log(error.message);
  }

  console.log("Try Catch skipped at getAllUsers()");
  return null;
}
