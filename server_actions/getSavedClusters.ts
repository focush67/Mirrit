"use server";

import { Saved } from "@/models/saved-posts-schema";
import { SavedPosts } from "@/types/state";
import { authOptions } from "@/utilities/auth";
import { AuthOptions, getServerSession } from "next-auth";

export default async function getUserSavedCluster() {
  const session = await getServerSession(authOptions as AuthOptions);
  try {
    const cluster: SavedPosts | null = await Saved.findOne({
      email: session?.user?.email,
    });
    return cluster;
  } catch (error: any) {
    console.log("Error at getUserSavedCluster(): ", error.message);
    return null;
  }
}
