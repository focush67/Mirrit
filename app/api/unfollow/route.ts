import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Profiles } from "@/models/user-profile-schema";

export const POST = async (request: NextRequest) => {
  await connect();
  const initiator = request.nextUrl.searchParams.get("initiator");
  const target = request.nextUrl.searchParams.get("target");

  console.log({ initiator, target });

  try {
    const initiatorUser = await Profiles.findOne({ email: initiator });
    const targetUser = await Profiles.findOne({ email: target });

    if (!initiatorUser || !targetUser) {
      return NextResponse.json({
        message: "A user was missing",
        status: 404,
      });
    }

    console.log({ initiatorUser, targetUser });

    if (
      initiatorUser.following.find(
        (user: any) => user.email === targetUser.email
      ) &&
      targetUser.followers.find(
        (user: any) => user.email === initiatorUser.email
      )
    ) {
      initiatorUser.following = initiatorUser.following.filter(
        (user: any) => user.email !== targetUser.email
      );
      targetUser.followers = targetUser.followers.filter(
        (user: any) => user.email !== initiatorUser.email
      );

      await initiatorUser.save();
      await targetUser.save();

      return NextResponse.json({
        message: "Unfollowed",
        status: 200,
        first: initiatorUser,
        second: targetUser,
      });
    } else {
      return NextResponse.json({
        message: "Not following",
        status: 404,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      message: error.message,
      status: 406,
    });
  }
};
