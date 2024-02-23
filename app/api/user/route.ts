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
  const finalResponse = removeTimeFields(users);

  return NextResponse.json({
    message: "Returning all users",
    users: finalResponse,
    status: 201,
  });
};
