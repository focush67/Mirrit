import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Profiles } from "@/models/user-profile-schema";

export const POST = async (request: NextRequest) => {
  await connect();

  const initiator = request.nextUrl.searchParams.get("initiator");
  const target = request.nextUrl.searchParams.get("target");

  try {
    const initiatorUser = await Profiles.findOne({ email: initiator });
    const targetUser = await Profiles.findOne({ email: target });

    if (!initiatorUser || !targetUser) {
      return NextResponse.json({
        message: "A user was missing",
        status: 404,
      });
    }

    if (
      initiatorUser.following.find(
        (user: any) => user.email === targetUser.email
      ) &&
      targetUser.followers.find(
        (user: any) => user.email === initiatorUser.email
      )
    ) {
      console.log("Already following");
      return NextResponse.json({
        message: "Already following",
        status: 301,
      });
    }

    initiatorUser.following = [...initiatorUser.following, targetUser];
    targetUser.followers = [...targetUser.followers, initiatorUser];

    await initiatorUser.save();
    await targetUser.save();

    return NextResponse.json({
      message: "Followed",
      status: 201,
      first: initiatorUser,
      second: targetUser,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      message: error.message,
      status: 406,
    });
  }
};
