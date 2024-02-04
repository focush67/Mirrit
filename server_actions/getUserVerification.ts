import { Profiles } from "@/models/user-profile-schema";
import { Session, getServerSession } from "next-auth";

export default async function getUserVerification() {
  const serverSession = await getServerSession();
  console.log("Session: ", serverSession);
  if (!serverSession) {
    console.log("No session found at server action");
    return null;
  }

  const verificationStatus = await Profiles.findOne({
    email: serverSession?.user?.email,
  });

  if (verificationStatus) {
    console.log("Status: ", verificationStatus);
    return verificationStatus;
  } else {
    const newlyVerifiedUser = await Profiles.create({
      email: serverSession.user?.email,
      name: serverSession?.user?.name,
      image: serverSession?.user?.image,
    });

    await newlyVerifiedUser.save();

    console.log("Newly verified user: ", newlyVerifiedUser);
    return newlyVerifiedUser;
  }
}
