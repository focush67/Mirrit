import { getSelf, getUserByUsername } from "@/services/auth-service";
import React from "react";
import UserProfileCard from "./(profile-card)/user-profile-card";
import { isFollowingGivenUser } from "@/services/follow-service";
import { getCurrentUserPosts, getPostsByOwner } from "@/services/posts-service";
import PostCard from "@/components/post-components/post-card";

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
  const posts = await getPostsByOwner(username);
  return (
    <div>
      <UserProfileCard
        profile={profile!}
        visitor={user!}
        followStatus={followStatus}
      />
      <div className="flex justify-center items-center overflow-hidden">
        <div className="grid sm:grid-cols-2 gap-2 lg:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {posts?.map((post) => (
            <PostCard post={post} key={post.id} size="small" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
