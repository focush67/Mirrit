import { NextRequest, NextResponse } from "next/server";
import { Saved } from "@/models/saved-posts-schema";
import connect from "@/utilities/mongoose";
import { Posts } from "@/models/post-schema";
import mongoose from "mongoose";

export const GET = async (request: NextRequest) => {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    console.log("Email missing at /api/saved get");
    return NextResponse.json({
      message: "Email not passed",
      status: 404,
    });
  }

  try {
    const SavedPostsCluster = await Saved.findOne({ email });

    if (!SavedPostsCluster) {
      console.log("Saved Posts cluster not found");
      return NextResponse.json({
        message: "Posts cluster was not found",
        status: 404,
      });
    }

    const requestedClusterPosts = await Posts.find({
      _id: { $in: SavedPostsCluster.posts },
    });

    return NextResponse.json({
      message: "Returning the posts cluster",
      status: 200,
      cluster: SavedPostsCluster,
      savedPosts: requestedClusterPosts,
    });
  } catch (error: any) {
    console.error("Error fetching saved posts:");
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
};

export const POST = async (request: NextRequest) => {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    console.log("Email missing at /api/saved post");
    return NextResponse.json({
      message: "Email not passed",
      status: 404,
    });
  }

  const requestBody = await request.json();

  const { _id } = requestBody;

  const SavedPostsCluster = await Saved.findOne({ email });

  if (!SavedPostsCluster) {
    const createdCluster = await Saved.create({
      email,
      posts: [_id],
    });

    await createdCluster.save();

    // console.log("Created new cluster: ", createdCluster);
    return NextResponse.json({
      message: "Cluster initialized and post saved",
      status: 201,
      cluster: SavedPostsCluster,
      newResponse: createdCluster,
    });
  } else {
    console.log("Post ID: ", _id);
    console.log(SavedPostsCluster.posts);
    const result = SavedPostsCluster.posts.filter(
      (postId: mongoose.ObjectId) => postId.toString() === _id
    );

    console.log("Result: ", result);

    if (result.length === 0) {
      SavedPostsCluster.posts.push(_id);
      await SavedPostsCluster.save();
      return NextResponse.json({
        message: "Post added to exisitng cluster",
        status: 200,
        cluster: SavedPostsCluster,
      });
    } else {
      return NextResponse.json({
        status: 303,
        result: result,
      });
    }
  }
};

export const DELETE = async (request: NextRequest) => {
  const email = request.nextUrl.searchParams.get("email");
  const _id = request.nextUrl.searchParams.get("_id");

  console.log({ email, _id });

  if (!email || !_id) {
    console.log("Email or _id missing at /api/saved post");
    return NextResponse.json({
      message: "Email or _id not passed",
      status: 404,
    });
  }

  try {
    const savedPostsCluster = await Saved.findOne({ email });
    if (!savedPostsCluster) {
      return NextResponse.json({
        message: "Cluster not found so not deleting anything",
        status: 404,
      });
    }

    savedPostsCluster.posts = savedPostsCluster.posts.filter(
      (postId: any) => postId.toString() !== _id
    );

    await savedPostsCluster.save();

    return NextResponse.json({
      message: "Post removed from saved",
      status: 201,
      cluster: savedPostsCluster,
    });
  } catch (error: any) {
    console.error("Error deleting post from cluster:", error.message);
    return NextResponse.json({
      message: "Internal Server Error",
      status: 500,
    });
  }
};
