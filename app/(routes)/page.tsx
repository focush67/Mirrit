import PostCard from "@/components/post-components/post-card";
import StorySidebar from "@/components/story-components/story-wrapper";
import { getAllPosts } from "@/server_actions/posts";
import React from "react";

const HomePageLayout = async () => {
  const posts = await getAllPosts();
  return (
    <div className="mt-12 py-8 flex flex-wrap justify-center">
      <StorySidebar />
      <div className="flex flex-col items-center justify-center">
        {posts.map((post, index) => (
          <div className="mt-2 mb-2" key={index}>
            <PostCard key={post.id} post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageLayout;
