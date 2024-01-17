"use client";

import PostCard from "@/components/post/post-card";
import ProfileCard from "@/components/profile/profile-card";
import useFetchAllUsers from "@/custom_hooks/fetching_hooks/useFetchAllUsers";
import useFetchUserPosts from "@/custom_hooks/fetching_hooks/useFetchUserPosts";
import {
  addAllSavedPosts,
  addAllUsers,
  addPostsChunk,
} from "@/redux_store/slices/global-slices";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/profile";
import { GlobalState } from "@/types/state";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const { data: session } = useSession();

  const { posts } = useFetchUserPosts({ email: session?.user?.email! });
  const { users } = useFetchAllUsers();

  const dispatch = useDispatch();

  const cluster = useSelector((state: GlobalState) => state.saved);

  useEffect(() => {
    if (posts && posts.length > 0) {
      dispatch(addPostsChunk(posts));
    }

    if (users && users.length > 0) {
      dispatch(addAllUsers(users));
    }

    if (cluster) {
      dispatch(
        addAllSavedPosts({
          email: cluster.email,
          postIds: cluster.posts,
        })
      );
    }
  }, [posts, dispatch, users]);

  const allPosts = useSelector((state: GlobalState) => state.posts);

  const allUsers = useSelector((state: GlobalState) => state.users);

  const profile = allUsers.find(
    (user: UserProfile) => user.email === session?.user?.email
  );

  const filteredPosts: Post[] = allPosts.filter(
    (post: Post) => post.email === session?.user?.email
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center">
        {/* Profile card */}
        <ProfileCard profile={profile!} />
      </div>
      {/* Image cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-4 gap-4 m-auto">
        {filteredPosts?.map((post: Post) => (
          <PostCard post={post} key={post._id} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
