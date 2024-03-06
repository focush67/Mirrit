import PostCard from "@/components/post-components/post-card";
import StorySidebar from "@/components/story-components/story-wrapper";
import { getAllPosts } from "@/server_actions/posts";
import React from "react";

const HomePageLayout = async () => {
  const posts = await getAllPosts();
  return (
    <div className="mt-12 py-8 flex">
      <div className="w-full">
        <StorySidebar />

        <div className="flex flex-col items-center mt-2">
          <div className="flex flex-col flex-1 gap-3 items-center w-fit">
            {posts.map((post, index) => (
              <div className="w-fit" key={index}>
                <PostCard key={post.id} post={post} size="small" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageLayout;
