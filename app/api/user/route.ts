import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utilities/database";
import { removeTimeFields } from "@/utilities/remove-fields";

export const GET = async (_: NextRequest) => {
  const users = await db.user.findMany({
    include: {
      following: true,
      followedBy: true,
    },
  });
  const allUsers = users.map((u) => ({
    id: u.id,
    username: u.username,
    externalUserId: u.externalUserId,
    bio: u.bio,
    imageUrl: u.imageUrl,
    followers: u.followedBy.map((f) => f.id),
    followedProfiles: u.following.map((f) => f.id),
  }));

  return NextResponse.json({
    message: "Returning all users",
    users: allUsers,
    status: 201,
  });
};
