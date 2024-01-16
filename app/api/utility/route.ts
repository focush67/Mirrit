import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Posts } from "@/models/post-schema";

export const GET = async (request: NextRequest) => {
  await connect();

  const id = request.nextUrl.searchParams.get("_id");

  if (!id) {
    return NextResponse.json({
      message: "ID not found at backend",
      status: 404,
    });
  }

  const post = await Posts.findById({ _id: id });

  if (!post) {
    return NextResponse.json({
      message: "Post not found",
      status: 404,
      post: post,
    });
  }

  console.log("Post: ", post);

  return NextResponse.json({
    message: "Returning post",
    status: 200,
    post: post,
  });
};
