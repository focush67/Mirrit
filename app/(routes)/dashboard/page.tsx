"use client";

import PostCard from "@/components/post/post-card";
import ProfileCard from "@/components/profile/profile-card";
import useFetchAllUsers from "@/custom_hooks/fetching_hooks/useFetchAllUsers";
import useFetchUserPosts from "@/custom_hooks/fetching_hooks/useFetchUserPosts";
import {
  addAllSavedPosts,
  addAllUsers,
  addPostsChunk,
  selectCurrentUser,
  selectPostsForCurrentUser,
  selectSavedCluster,
} from "@/redux_store/slices/global-slices";
import { Post } from "@/types/post";
import { GlobalState } from "@/types/state";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const { data: session } = useSession();

  const { posts } = useFetchUserPosts({ email: session?.user?.email! });
  const { users } = useFetchAllUsers();

  const dispatch = useDispatch();

  const cluster = useSelector(selectSavedCluster);

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

  const currentUserProfile = useSelector((state: GlobalState) =>
    selectCurrentUser(state, session?.user?.email!)
  );

  const filteredPosts = useSelector((state: GlobalState) =>
    selectPostsForCurrentUser(state, session?.user?.email!)
  );

  // console.log("Filtered Posts: ", filteredPosts);
  // console.log("Current User: ", currentUserProfile);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center">
        {/* Profile card */}
        <ProfileCard profile={currentUserProfile[0]} />
      </div>
      {/* Image cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex  xl:grid-cols-4 mt-4 gap-4 m-auto ml-auto items-center h-[100%]">
        {filteredPosts?.map((post: Post) => (
          <PostCard post={post} key={post._id} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
