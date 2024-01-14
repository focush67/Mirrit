import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/mongoose";
import { Profiles } from "@/models/user-profile-schema";
import { getServerSession } from "next-auth";

export const POST = async (request: NextRequest) => {
  const session = await getServerSession();
  await connect();

  const requestBody = await request.json();

  const { email, userName, image } = requestBody;
  console.log(requestBody);

  try {
    const doesAlreadyExist = await Profiles.findOne({ email });
    if (doesAlreadyExist) {
      return NextResponse.json({
        message: "Already exists",
        status: 303,
      });
    }
    const newCreatedUser = await Profiles.create({
      email: email || session?.user?.email,
      name: userName || session?.user?.name,
      image: image || session?.user?.image,
    });

    await newCreatedUser.save();

    return NextResponse.json({
      message: "User created",
      status: 201,
      user: newCreatedUser,
    });
  } catch (error: any) {
    console.log("Error at /api/register", error.message);
    return NextResponse.json({
      message: "Error at /api/register",
      status: 500,
    });
  }
};
