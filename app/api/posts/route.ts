import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Posts } from "@/models/post-schema";

export const GET = async (request: NextRequest) => {
  await connect();

  const email = request.nextUrl.searchParams.get("email");
  if (email) {
    const userPosts = await Posts.find({ email });
    return NextResponse.json({
      message: "Returning posts for the requested user",
      posts: userPosts,
    });
  }
  const allPosts = await Posts.find();

  return NextResponse.json({
    posts: allPosts,
  });
};

export const POST = async (request: NextRequest) => {
  const requestBody = await request.json();
  const { newPost } = requestBody;

  console.log(newPost);

  const {
    email,
    title,
    description,
    image,
    userName,
    tags,
    cover,
    likes,
    comments,
    shares,
  } = newPost;

  try {
    const freshPost = await Posts.create({
      email,
      title,
      description,
      image,
      userName,
      tags,
      cover,
      likes,
      comments,
      shares,
    });

    await freshPost.save();

    return NextResponse.json({
      message: "Post saved",
      status: 201,
      post: freshPost,
    });
  } catch (error: any) {
    console.log("Error at /api/posts");
    return NextResponse.json({
      message: error.message,
      status: 500,
    });
  }
};
