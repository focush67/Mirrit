import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utilities/database";

export const GET = async (_: NextRequest) => {
  const posts = await db.post.findMany({
    include: {
      owner: true,
      likes: true,
      comments: true,
      saved: true,
    },
  });
  return NextResponse.json({
    message: "Returning all posts",
    posts: posts,
    status: 201,
  });
};
