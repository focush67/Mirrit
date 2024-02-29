import { db } from "@/utilities/database";
import { getSelf } from "./auth-service";

export const getAllStories = async () => {
  const stories = await db.story.findMany({
    include: {
      likes: true,
      owner: true,
    },
  });

  return stories;
};

export const hasLikedThisStory = async (storyId: string) => {
  const self = await getSelf();
  if (!self) {
    return;
  }

  const story = await db.story.findUnique({
    where: {
      id: storyId,
    },
    include: {
      likes: true,
    },
  });

  const status = story?.likes.some((like) => like.story_liker_id === self.id);
  return !!status;
};
