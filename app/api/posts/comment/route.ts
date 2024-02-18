import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Posts } from "@/models/post-schema";
import { getServerSession } from "next-auth";
import { Comment } from "@/types/comment";
import mongoose from "mongoose";
import getCurrentUser from "@/server_actions/getCurrentUser";

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
  await connect();

  const postId = request.nextUrl.searchParams.get("id");
  const requestBody = await request.json();
  const { comment } = requestBody;

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

export const DELETE = async (request: NextRequest) => {
  const session = await getCurrentUser();
  console.log({ session });
  if (!session) {
    return NextResponse.json({
      message: "Unauthorized Request",
      status: 405,
    });
  }
  try {
    const requestedBy = request.nextUrl.searchParams.get("requestedBy");
    const postId = request.nextUrl.searchParams.get("postId");
    const commentId = request.nextUrl.searchParams.get("commentId");

    console.log({ requestedBy, postId, commentId });

    if (!commentId) {
      return NextResponse.json({
        message: "Comment ID not found",
        status: 404,
      });
    }

    if (session?.email !== requestedBy) {
      return NextResponse.json({
        message:
          "Requested User and Logged In user are different, unauthoried request",
        status: 405,
      });
    }

    const post = await Posts.findById({ _id: postId });

    if (!post) {
      return NextResponse.json({
        message: "Not found post",
        status: 404,
      });
    }

    post.comments = post.comments.filter(
      (comment: any) => String(comment._id) !== commentId
    );

    await post.save();

    return NextResponse.json({
      message: "Comment Deleted",
      status: 200,
      length: post.comments.length,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      message: "Some error occured at backend",
      status: 500,
    });
  }
};
