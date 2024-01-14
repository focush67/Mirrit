"use client";

import useFetchCurrentUser from "@/custom_hooks/fetching_hooks/useFetchCurrentUser";
import useFetchUserPosts from "@/custom_hooks/fetching_hooks/useFetchUserPosts";
import React from "react";
import PostCard from "@/components/post/post-card";
import ProfileCard from "@/components/profile/profile-card";

const Profile = ({ params }: any) => {
  let email = params.id.slice(0, params.id.indexOf("%"));
  email = email.concat("@gmail.com");

  const { user } = useFetchCurrentUser({ email });
  const { posts } = useFetchUserPosts({ email });

  return (
    <>
      <div className="flex items-center justify-center mt-1">
        <ProfileCard profile={user!} />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mt-4 gap-4 ">
        {posts.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
    </>
  );
};

export default Profile;
