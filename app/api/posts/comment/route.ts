import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Posts } from "@/models/post-schema";
import { getServerSession } from "next-auth";

export const GET = async (request: NextRequest) => {
  await connect();

  const postId = request.nextUrl.searchParams.get("id");
  try {
    const post = await Posts.findById({ _id: postId });
    const comments = await post.comments;
    return NextResponse.json({
      message: "Returning comments for the requested post",
      comments: comments,
    });
  } catch (error: any) {
    console.log("Error at /api/posts/comment");
    return NextResponse.error();
  }
};

export const POST = async (request: NextRequest) => {
  // const session = await getServerSession();
  // if (!session) {
  //   return NextResponse.json({
  //     message: "Login required",
  //     status: 405,
  //   });
  // }
  await connect();

  const postId = request.nextUrl.searchParams.get("id");
  const requestBody = await request.json();
  const { comment } = requestBody;

  // console.log("Comment from frontend: ", comment);

  try {
    const postToBeCommentedOn = await Posts.findById({ _id: postId });
    postToBeCommentedOn.comments = [...postToBeCommentedOn.comments, comment];
    await postToBeCommentedOn.save();

    return NextResponse.json({
      message: "Comment added successfully",
      status: 201,
      post: postToBeCommentedOn,
    });
  } catch (error: any) {
    console.log("Error at /api/posts/comment");
    return NextResponse.json({
      message: error.message,
      status: 500,
    });
  }
};
