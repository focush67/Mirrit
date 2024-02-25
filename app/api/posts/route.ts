import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utilities/database";
import { getUserById } from "@/services/user-service";
import { removeTimeFields } from "@/utilities/remove-fields";

export const GET = async (_: NextRequest) => {
  const posts = await db.post.findMany({
    include: {
      owner: true,
      likes: true,
      comments: true,
      saved: true,
    },
  });

  const finalResponse = await Promise.all(
    posts.map(async (p) => {
      const comments = await Promise.all(
        p.comments.map(async ({ createdAt, updatedAt, ...comment }) => {
          const owner = await getUserById(comment.commented_by_Id);
          return {
            ...comment,
            owner: removeTimeFields(owner),
          };
        })
      );

      return {
        cover: p.cover,
        id: p.id,
        owner_Id: p.owner_Id,
        title: p.title,
        description: p.description,
        owner: removeTimeFields(p.owner),
        likes: removeTimeFields(p.likes),
        comments,
        saved: removeTimeFields(p.saved),
      };
    })
  );

  return NextResponse.json({
    message: "Returning all posts",
    posts: finalResponse,
    status: 201,
  });
};
