import { db } from "@/utilities/database";
import { getSelf } from "./auth-service";
import { pusherServer } from "@/utilities/pusher";

export const isFollowingGivenUser = async (id: string) => {
  const self = await getSelf();
  const targetUser = await db.user.findUnique({
    where: {
      id,
    },
  });
  if (!targetUser) {
    console.log("Target User not found at following service");
    throw new Error("Followed User was not found");
  }
  if (!self) {
    throw new Error("Unauthorized request at following service");
  }
  if (targetUser.id === self.id) {
    console.log("You are always following yourself");
    return true;
  }
  const existingFollowStatus = await db.follow.findFirst({
    where: {
      follower_Id: self.id,
      following_Id: targetUser.id,
    },
  });
  return !!existingFollowStatus;
};

export const FollowGivenUser = async (id: string) => {
  const self = await getSelf();
  const targetUser = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!targetUser) {
    console.log("User to be followed not found");
    throw new Error("Not found user");
  }

  if (!self) {
    throw new Error("Unauthorized Request for Following User");
  }

  if (targetUser.id === self.id) {
    console.log("You are already following yourself");
    throw new Error("Already following yourself");
  }

  const presentFollowStatus = await db.follow.findFirst({
    where: {
      follower_Id: self.id,
      following_Id: targetUser.id,
    },
  });

  if (presentFollowStatus) {
    console.log("Already following said user");
    throw new Error("Already following");
  }

  const followRequest = await db.follow.create({
    data: {
      follower_Id: self.id,
      following_Id: targetUser.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });

  const notification = await db.notification.create({
    data: {
      senderId: self.id,
      receiverId: targetUser.id,
      type: "follow",
    },
  });

  const newNotif = await db.notification.findUnique({
    where: {
      id: notification.id,
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  console.log(
    `Sending follow notification to ${followRequest.following.externalUserId}`
  );

  await pusherServer.trigger(
    `${followRequest.following.externalUserId}`,
    "follow-notification",
    newNotif
  );

  return followRequest;
};

export const UnfollowGivenUser = async (id: string) => {
  const self = await getSelf();
  const targetUser = await db.user.findUnique({
    where: {
      id,
    },
  });
  if (!targetUser) {
    console.log("User to be unfollowed not found");
    throw new Error("User to be unfollowed not found");
  }

  if (!self) {
    throw new Error("Unauthorized Unfollow Request");
  }

  if (targetUser.id === self.id) {
    throw new Error("Cannot unfollow yourself");
  }

  const existingFollowStatus = await db.follow.findFirst({
    where: {
      follower_Id: self.id,
      following_Id: targetUser.id,
    },
  });

  if (!existingFollowStatus) {
    console.log("You have to be following the user to unfollow them");
    throw new Error("Cannot Unfollow the user");
  }

  const newFollowStatus = await db.follow.delete({
    where: {
      id: existingFollowStatus.id,
    },
    include: {
      following: true,
    },
  });

  return newFollowStatus;
};

export const getYourFollowers = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("Login required for fetching following profiles");
    return null;
  }

  const profiles = await db.follow.findMany({
    where: {
      following_Id: self.id,
    },
    include: {
      follower: true,
    },
  });

  const filteredProfiles = profiles.map((profile) => ({
    ...profile.follower,
  }));

  console.log(" these profiles follow you ", filteredProfiles.length);
  return filteredProfiles;
};

export const getProfilesFollowed = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("Login required for fetching profiles who follow this user");
    return null;
  }

  const profiles = await db.follow.findMany({
    where: {
      follower_Id: self.id,
    },
    include: {
      following: true,
    },
  });
  const filteredProfiles = profiles.map((profile) => ({
    ...profile.following,
  }));

  console.log("You follow these profiles ", filteredProfiles.length);
  return filteredProfiles;
};

export const RemoveFollower = async (id: string) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to remove the follower");
    return null;
  }
  const removedFollower = await db.follow.delete({
    where: {
      follower_Id_following_Id: {
        follower_Id: id,
        following_Id: self.id,
      },
    },
  });

  console.log("Server action for removing follower ", removedFollower);
  return removedFollower;
};
