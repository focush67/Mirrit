import { getSelf, getUserByUsername } from "@/services/auth-service";
import React from "react";
import UserProfileCard from "./(profile-card)/user-profile-card";
import { isFollowingGivenUser } from "@/services/follow-service";

interface UserProfileProps {
  params: {
    username: string;
  };
}
const Page = async ({ params }: UserProfileProps) => {
  const { username } = params;
  const profile = await getUserByUsername(username);
  if (!profile) {
    throw new Error("No profile found, refresh");
  }
  const user = await getSelf();
  const followStatus = await isFollowingGivenUser(profile.id);
  return (
    <div>
      <UserProfileCard
        profile={profile!}
        visitor={user!}
        followStatus={followStatus}
      />
    </div>
  );
};

export default Page;
