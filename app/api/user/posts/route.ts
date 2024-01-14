import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Posts } from "@/models/post-schema";
import { getServerSession } from "next-auth";

export const GET = async (request: NextRequest) => {
  const session = getServerSession();
  if (!session) {
    return NextResponse.json({
      message: "Login required",
      status: 405,
    });
  }
  await connect();
  const postId = request.nextUrl.searchParams.get("id");

  const allPostsForRequestedUser = await Posts.findById({ _id: postId });

  return NextResponse.json({
    posts: allPostsForRequestedUser,
  });
};
