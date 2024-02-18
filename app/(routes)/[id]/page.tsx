"use client";

import useFetchUserPosts from "@/custom_hooks/fetching_hooks/useFetchUserPosts";
import React, { useEffect } from "react";
import PostCard from "@/components/post/post-card";
import ProfileCard from "@/components/profile/profile-card";
import { useDispatch, useSelector } from "react-redux";
import useFetchAllUsers from "@/custom_hooks/fetching_hooks/useFetchAllUsers";

import {
  addAllUsers,
  selectCurrentUser,
} from "@/redux_store/slices/users/user-slice";
import {
  addPostsChunk,
  resetPosts,
} from "@/redux_store/slices/posts/post-slice";
import { Post } from "@/types/post";
import { StateType } from "@/redux_store/store";
import { selectPostsForCurrentUser } from "@/redux_store/slices/posts/post-slice";

const Profile = ({ params }: any) => {
  let email = params.id.slice(0, params.id.indexOf("%"));
  email = email.concat("@gmail.com");

  const profile = useSelector((state: StateType) =>
    selectCurrentUser(state, email)
  );

  const filteredPosts = useSelector((state: StateType) =>
    selectPostsForCurrentUser(state, email)
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <ProfileCard profile={profile!} />
      </div>
      <div className="w-full mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-10">
          {filteredPosts?.map((post: Post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
