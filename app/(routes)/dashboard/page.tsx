"use client";

import PostCard from "@/components/post/post-card";
import ProfileCard from "@/components/profile/profile-card";
import {
  selectCurrentUser,
  selectPostsForCurrentUser,
} from "@/redux_store/slices/global-slices";
import { Post } from "@/types/post";
import { GlobalState } from "@/types/state";
import { useSession } from "next-auth/react";
import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { data: session } = useSession();

  const currentUserProfile = useSelector((state: GlobalState) =>
    selectCurrentUser(state, session?.user?.email!)
  );

  const filteredPosts = useSelector((state: GlobalState) =>
    selectPostsForCurrentUser(state, session?.user?.email!)
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center w-full">
        <ProfileCard profile={currentUserProfile[0]} />
      </div>
      <div className="flex justify-center items-center mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 gap-4">
          {filteredPosts?.map((post: Post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
