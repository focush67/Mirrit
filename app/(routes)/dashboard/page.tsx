"use client";

import PostCard from "@/components/post/post-card";
import ProfileCard from "@/components/profile/profile-card";
import { selectPostsForCurrentUser } from "@/redux_store/slices/posts/post-slice";

import { selectCurrentUser } from "@/redux_store/slices/users/user-slice";
import { Post } from "@/types/post";
import { StateType } from "@/redux_store/store";
import { useSession } from "next-auth/react";
import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { data: session } = useSession();

  const currentUserProfile = useSelector((state: StateType) =>
    selectCurrentUser(state, session?.user?.email!)
  );

  const filteredPosts = useSelector((state: StateType) =>
    selectPostsForCurrentUser(state, session?.user?.email!)
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center w-full">
        <ProfileCard profile={currentUserProfile!} />
      </div>
      <div className="flex justify-center items-center mt-4 overflow-hidden">
        <div className="grid sm:grid-cols-2 gap-2 lg:gap-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 ">
          {filteredPosts?.map((post: Post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
