import { Posts } from "@/models/post-schema";
import connect from "@/utilities/mongoose";

export default async function getAllPosts() {
  await connect();
  try {
    const posts = await Posts.find();
    return posts;
  } catch (error: any) {
    console.log("Error at getAllPosts() server action: ", error.message);
  }
  console.log("Try catch skipped at getAllPosts()");
  return null;
}
