"use client";

import PostCard from "@/components/post/post-card";
import ProfileCard from "@/components/profile/profile-card";
import useFetchAllUsers from "@/custom_hooks/fetching_hooks/useFetchAllUsers";
import useFetchUserPosts from "@/custom_hooks/fetching_hooks/useFetchUserPosts";
import {
  addAllUsers,
  addPostsChunk,
  resetPosts,
} from "@/redux_store/slices/global-slices";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/profile";
import { GlobalState } from "@/types/state";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const { data: session } = useSession();

  const { posts } = useFetchUserPosts({ email: session?.user?.email! });
  const { users } = useFetchAllUsers();
  const dispatch = useDispatch();

  useEffect(() => {
    if (posts && posts.length > 0) {
      dispatch(addPostsChunk(posts));
    }

    if (users && users.length > 0) {
      dispatch(addAllUsers(users));
    }

    return () => {
      console.log("Resetting state");
      dispatch(resetPosts());
    };
  }, [posts, dispatch, users]);

  const allPosts = useSelector((state: GlobalState) => state.posts);

  const allUsers = useSelector((state: GlobalState) => state.users);

  const profile = allUsers.find(
    (user: UserProfile) => user.email === session?.user?.email
  );

  const filteredPosts: Post[] = allPosts.filter(
    (post: Post) => post.email === session?.user?.email
  );

  console.log("filtered posts: ", filteredPosts);

  return (
    <div className="flex flex-col justify-center items-center lg:flex-row lg:justify-center lg:items-center">
      <div>
        {/* Profile card */}
        <div className="flex items-center justify-center mt-1">
          <ProfileCard profile={profile!} />
        </div>
        {/* Image cards */}
        <div className="grid sm:grid-cols-2 sm:ml-[3em] md:grid-cols-3 xl:grid-cols-4 mt-4 gap-4">
          {filteredPosts?.map((post: Post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
