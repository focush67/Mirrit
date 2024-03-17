import PostCard from "@/components/post-components/post-card";
import { getSavedPosts } from "@/services/posts-service";
import React from "react";

const Saved = async () => {
  const savedPosts = await getSavedPosts();
  return (
    <div>
      {savedPosts?.length === 0 ? (
        <div>
          <div className="text-2xl">Wow So Empty</div>
          <div>Save Posts to see them here</div>
        </div>
      ) : (
        <div className="grid sm:flex sm:gap-x-2 sm:items-center sm:justify-center md:grid-cols-3 lg:grid-cols-4 place-items-center gap-y-2">
          {savedPosts?.map((post, index) => (
            <PostCard key={index} post={post} size="small" removeSaved={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
