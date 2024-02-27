import PostCard from "@/components/post-components/post-card";
import { getSavedPosts } from "@/services/posts-service";

import React from "react";

const Saved = async () => {
  const savedPosts = await getSavedPosts();
  return (
    <div className="mt-5 grid sm:grid-cols-2 gap-2 lg:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {savedPosts?.map((item) => (
        <PostCard post={item} size="small" key={item.id} removeSaved={true} />
      ))}
    </div>
  );
};

export default Saved;
