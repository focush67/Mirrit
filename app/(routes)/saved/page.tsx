import PostCard from "@/components/post-components/post-card";
import { getSavedPosts } from "@/services/posts-service";
import React from "react";

const Saved = async () => {
  const savedPosts = await getSavedPosts();
  return (
    <div className="w-full mt-5 grid grid-cols-2 gap-2 md:grid-cols-2 lg:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {savedPosts?.length === 0 && (
        <div className="flex flex-col items-center justify-end">
          <div>Wow So Empty</div>
          <div>Save Posts appear here</div>
        </div>
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
