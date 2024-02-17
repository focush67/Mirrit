"use server";

import { Posts } from "@/models/post-schema";
import { Post } from "@/types/post";
import { authOptions } from "@/utilities/auth";
import { AuthOptions, getServerSession } from "next-auth";

export default async function getUserPosts() {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session) {
    console.log(
      "Session missing in server action for getting posts for current user"
    );
    return null;
  }

  try {
    const userPosts: Post[] = await Posts.find({ email: session?.user?.email });
    console.log("User posts: ", userPosts);

    return userPosts;
  } catch (error: any) {
    console.log("Error at getUserPosts() server action: ", error.message);
    return null;
  }
}
