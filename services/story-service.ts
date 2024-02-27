import { db } from "@/utilities/database";
import { getSelf } from "./auth-service";

export const getAllStories = async () => {
  const stories = await db.story.findMany({
    include: {
      owner: true,
      likes: true,
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

  const status = story?.likes.some((like) => like.liked_by_Id === self.id);
  return !!status;
};
