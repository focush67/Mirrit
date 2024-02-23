import { NextRequest, NextResponse } from "next/server";
import { getSavedPostsIds } from "@/services/posts-service";
import { removeTimeFields } from "@/utilities/remove-fields";

export const GET = async (_: NextRequest) => {
  const results = await getSavedPostsIds();
  const ids = results?.savedPosts.map((post) => post.id);

  const finalResponse = {
    savedPosts: ids,
    user: removeTimeFields(results),
  };

  return NextResponse.json({
    message: "Returning all saved posts ids",
    status: 201,
    savedPostsIds: finalResponse,
  });
};
