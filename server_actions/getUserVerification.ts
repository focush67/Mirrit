import { Profiles } from "@/models/user-profile-schema";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default async function getUserVerification({ session }: Props) {
  if (!session) {
    console.log("No session found at server action");
    return null;
  }

  const verificationStatus = await Profiles.findOne({
    email: session?.user?.email,
  });

  if (verificationStatus) {
    console.log("Status: ", verificationStatus);
    return verificationStatus;
  } else {
    const newlyVerifiedUser = await Profiles.create({
      email: session.user?.email,
      name: session?.user?.name,
      image: session?.user?.image,
    });

    await newlyVerifiedUser.save();

    console.log("Newly verified user: ", newlyVerifiedUser);
    return newlyVerifiedUser;
  }

  return null;
}
