"use server";

import { Story } from "@prisma/client";
import { db } from "@/utilities/database";
import { getSelf } from "@/services/auth-service";
import { revalidatePath } from "next/cache";

export const onCreateStory = async (story: Partial<Story>) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to create a story");
    return null;
  }

  const newStory = await db.story.create({
    data: {
      title: story?.title!,
      storyCover: story?.storyCover!,
      ownerId: self?.id!,
    },
  });

  console.log("Server action for story creation ", newStory);
  return newStory;
};

export const onLikeStory = async (story: Partial<Story>) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to like a story");
    return null;
  }

  const newLike = await db.likeForStory.create({
    data: {
      story_Id: story?.id!,
      story_liker_id: self.id,
    },
  });

  console.log("Server action for liking story ", newLike);
  return newLike;
};

export const onDeleteStory = async (storyId: string) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to delete your story");
    return null;
  }

  const deleteStory = await db.story.delete({
    where: {
      id: storyId,
    },
  });

  revalidatePath("/");
  return deleteStory;
};
