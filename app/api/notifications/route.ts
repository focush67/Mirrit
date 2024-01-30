import { Notification } from "@/models/notification-schema";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { to, from, post, type } = await request.json();

  console.log({ to, from, post, type });

  try {
    const newNotif = await Notification.create({
      type,
      from,
      to,
      post,
    });

    await newNotif.save();
    return NextResponse.json({
      message: "Notification Saved",
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      message: "Internal Server ERROR",
      status: 500,
    });
  }
};
