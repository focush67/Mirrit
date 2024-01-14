"use client";

import PostCard from "@/components/post/post-card";
import ProfileCard from "@/components/profile/profile-card";
import useFetchUserPosts from "@/custom_hooks/fetching_hooks/useFetchUserPosts";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/profile";
import { GlobalState } from "@/types/state";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { posts } = useFetchUserPosts({ email: session?.user?.email! });
  const allPosts = useSelector((state: GlobalState) => state.posts.posts);

  const allUsers = useSelector((state: GlobalState) => state.users.users);

  console.log("users: ", allUsers);
  console.log("posts: ", allPosts);

  let filteredAllPosts: Post[] = [];

  useEffect(() => {
    if (allUsers && allUsers.length > 0 && session) {
      const userWithEmail = allUsers.find(
        (user: UserProfile) => user.email === session.user?.email
      );

      if (userWithEmail) {
        setProfile(userWithEmail);
      }

      filteredAllPosts = allPosts.filter(
        (post: Post) => post.email === session?.user?.email
      );
    }
  }, [session, allUsers, allPosts]);

  console.log("filtered posts: ", filteredAllPosts);

  return (
    <>
      <div className="flex items-center justify-center mt-1">
        <ProfileCard profile={profile!} />
      </div>
      <div className="grid sm:grid-cols-2 sm:ml-[3em] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mt-4 gap-4 ">
        {posts?.map((post: Post) => (
          <PostCard post={post} />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
