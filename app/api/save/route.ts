import { NextRequest, NextResponse } from "next/server";
import { getSavedPostsIds } from "@/services/posts-service";

export const GET = async (_: NextRequest) => {
  const results = await getSavedPostsIds();
  const ids = results?.savedPosts.map((post) => post.id);

  const finalResponse = {
    savedPosts: ids,
    user: {
      id: results?.id,
      username: results?.username,
      imageUrl: results?.imageUrl,
      externalUserId: results?.externalUserId,
      bio: results?.bio,
      createdAt: Date,
      updatedAt: Date,
    },
  };
  return NextResponse.json({
    message: "Returning all saved posts ids",
    status: 201,
    savedPostsIds: finalResponse,
  });
};
