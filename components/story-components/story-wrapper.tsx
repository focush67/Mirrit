import Story from "@/components/story-components/story-component";
import { getSelf } from "@/services/auth-service";
import { getAllStories, hasLikedThisStory } from "@/services/story-service";
import React from "react";

const StorySidebar = async () => {
  const stories = await getAllStories();
  const self = await getSelf();
  if (!stories || stories.length === 0) {
    return null;
  }

  const likedStati = await Promise.all(
    stories.map(async (story) => await hasLikedThisStory(story.id))
  );
  const formattedStories = stories.map((story, index) => ({
    ...story,
    status: likedStati[index],
  }));
  return (
    <div className="mt-2 fixed top-0 left-0 z-[100] flex ml-2 overflow-x-auto">
      <Story stories={formattedStories} logged={self!} />
    </div>
  );
};

export default StorySidebar;
