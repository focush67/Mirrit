import PostCard from "@/components/post-components/post-card";
import { getSavedPosts } from "@/services/posts-service";
import React from "react";

const Saved = async () => {
  const savedPosts = await getSavedPosts();
  return (
    <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-2 lg:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {savedPosts?.length === 0 && (
        <p className="text-center ml-10">Save posts to see them here</p>
      )}
      {savedPosts?.map((item) => (
        <div key={item.id} className="mb-2 ml-3 mr-3">
          <PostCard post={item} size="small" removeSaved={true} />
        </div>
      ))}
    </div>
  );
};

export default Saved;
