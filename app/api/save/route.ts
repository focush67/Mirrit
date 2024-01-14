import { NextRequest, NextResponse } from "next/server";
import { Saved } from "@/models/saved-posts-schema";
import connect from "@/utilities/mongoose";
import { Post } from "@/types/post";

export const GET = async (request: NextRequest) => {
  await connect();

  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    console.log("Email missing at /api/saved get");
    return NextResponse.json({
      message: "Email not passed",
      status: 404,
    });
  }

  const SavedPostsCluster = await Saved.findOne({ email });

  if (!SavedPostsCluster) {
    console.log("Saved Posts cluster not found");
    return NextResponse.json({
      message: "Posts cluster was not found",
      status: 404,
    });
  }

  return NextResponse.json({
    message: "Returning the posts cluster",
    status: 200,
    posts: SavedPostsCluster.posts,
  });
};

export const POST = async (request: NextRequest) => {
  await connect();
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    console.log("Email missing at /api/saved post");
    return NextResponse.json({
      message: "Email not passed",
      status: 404,
    });
  }

  const requestBody = await request.json();

  const { newPost } = requestBody;

  const SavedPostsCluster = await Saved.findOne({ email });

  if (!SavedPostsCluster) {
    const createdCluster = await Saved.create({
      email,
      posts: [newPost],
    });

    await createdCluster.save();

    console.log("Created new cluster");
    return NextResponse.json({
      message: "Cluster initialized and post saved",
      status: 201,
      cluster: SavedPostsCluster,
    });
  } else {
    const temp = SavedPostsCluster.posts.some(
      (post: any) => post._id === newPost._id
    );

    if (!temp) {
      return NextResponse.json({
        message: "Already exists",
        status: 303,
      });
    }

    SavedPostsCluster.posts.push(newPost);
    await SavedPostsCluster.save();

    return NextResponse.json({
      message: "Post added to existing cluster",
      status: 200,
      cluster: SavedPostsCluster,
    });
  }
};

const isSamePost = (post1: Post, post2: Post) => {
  return (
    post1.title === post2.title &&
    post1.description === post2.description &&
    post1._id === post2._id
  );
};
