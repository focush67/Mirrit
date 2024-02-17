"use server";

import { Profiles } from "@/models/user-profile-schema";
import { UserProfile } from "@/types/profile";
import { authOptions } from "@/utilities/auth";
import { AuthOptions, getServerSession } from "next-auth";

export default async function getCurrentUser() {
  const session = await getServerSession(authOptions as AuthOptions);
  try {
    const user: UserProfile | null = await Profiles.findOne({
      email: session?.user?.email,
    });
    return user;
  } catch (error: any) {
    console.log("Error at getCurrentUser() server action: ", error.message);
    return null;
  }
}
