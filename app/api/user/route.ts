import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utilities/database";

export const GET = async (_: NextRequest) => {
  const users = await db.user.findMany({
    include: {
      following: true,
      followedBy: true,
    },
  });
  return NextResponse.json({
    message: "Returning all users",
    users: users,
    status: 201,
  });
};
