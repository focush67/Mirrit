import { Profiles } from "@/models/user-profile-schema";
import { UserProfile } from "@/types/profile";
import { authOptions } from "@/utilities/auth";
import connect from "@/utilities/mongoose";
import { AuthOptions, getServerSession } from "next-auth";

export default async function getCurrentUser() {
  await connect();
  const session = await getServerSession(authOptions as AuthOptions);
  try {
    const user: UserProfile | null = await Profiles.findOne({
      email: session?.user?.email,
    });
    return user;
  } catch (error: any) {
    console.log("Error at getCurrentUser() server action: ", error.message);
    return null;
  }
}
