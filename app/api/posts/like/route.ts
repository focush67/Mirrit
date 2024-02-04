import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Posts } from "@/models/post-schema";
import { getServerSession } from "next-auth";

// ENDPOINT LIKES A POST BY TAKING THE POSTID FROM THE URL PARAMETERS
export const POST = async (request: NextRequest) => {
  const session = getServerSession();
  if (!session) {
    return NextResponse.json({
      message: "Login required",
      status: 405,
    });
  }
  await connect();
  const postId = request.nextUrl.searchParams.get("id");
  console.log("Liking requested");

  const postToBeLiked = await Posts.findById({
    _id: postId,
  });

  if (!postToBeLiked) {
    return NextResponse.json({
      message: "Post was not found",
      status: 404,
    });
  }

  try {
    postToBeLiked.likes = Number(postToBeLiked.likes) + 1;
    await postToBeLiked.save();
    return NextResponse.json({
      post: postToBeLiked,
      status: 201,
    });
  } catch (error: any) {
    console.log("Error at /api/posts/like");
    return NextResponse.json({
      message: error.message,
      status: 500,
    });
  }
};
