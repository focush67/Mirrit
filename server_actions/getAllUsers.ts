import { Profiles } from "@/models/user-profile-schema";
import { UserProfile } from "@/types/profile";
import connect from "@/utilities/mongoose";

export default async function getAllUsers() {
  await connect();
  try {
    const users: UserProfile[] = await Profiles.find();
    if (!users) {
      console.log("No User Profiles found, returning null");
      return null;
    }

    return users as UserProfile[];
  } catch (error: any) {
    console.log("Error at server action getAllUsers()");
    console.log(error.message);
  }

  console.log("Try Catch skipped at getAllUsers()");
  return null;
}
