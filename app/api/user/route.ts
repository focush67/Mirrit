import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Profiles } from "@/models/user-profile-schema";

export const GET = async (request: NextRequest) => {
  await connect();

  const allUsers = await Profiles.find();

  const email = request.nextUrl.searchParams.get("email");

  if (email) {
    const requestedUser = await Profiles.findOne({ email });
    return NextResponse.json({
      message: "Giving requested user",
      user: requestedUser,
    });
  }

  return NextResponse.json({
    users: allUsers,
  });
};
