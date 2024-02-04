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

  // console.log(newPost);

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

export const DELETE = async (request: NextRequest) => {
  await connect();

  const _id = request.nextUrl.searchParams.get("_id");

  if (!_id) {
    return NextResponse.json({
      message: "Post not found",
      status: 404,
    });
  }

  try {
    const deletedPost = await Posts.findByIdAndDelete(_id);
    // console.log(deletedPost);
    if (!deletedPost) {
      return NextResponse.json({
        message: "Deletion not done",
        status: 405,
      });
    }

    return NextResponse.json({
      message: "Deletion successfull",
      status: 200,
      deletedPost,
    });
  } catch (error: any) {
    console.log("Error at /api/posts/delete", error.message);
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
};

export const PUT = async (request: NextRequest) => {
  const { editedPost } = await request.json();

  // const existingPost = await Posts.findById({ _id: id });

  const { _id } = editedPost;

  const exisitingPost = await Posts.findById({
    _id,
  });

  if (!exisitingPost) {
    return NextResponse.json({
      message: "No post found",
      status: 404,
    });
  }

  // console.log(exisitingPost);

  const {
    title,
    email,
    description,
    image,
    userName,
    tags,
    cover,
    likes,
    comments,
    shares,
  } = editedPost;

  const updatedPost = await Posts.findByIdAndUpdate(_id, {
    title,
    email,
    description,
    image,
    userName,
    tags,
    cover,
    likes,
    comments,
    shares,
  });

  await updatedPost.save();

  return NextResponse.json({
    done: "yes",
    status: 200,
    editedPost: updatedPost,
  });
};
