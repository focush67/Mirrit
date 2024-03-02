"use server";

import { getSelf } from "@/services/auth-service";
import { db } from "@/utilities/database";
import { pusherServer } from "@/utilities/pusher";
import { Group, User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const onCreateGroup = async ({
  group,
  color,
}: {
  group: Partial<Group>;
  color: string;
}) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to create a group");
    return null;
  }

  const newGroup = await db.group.create({
    data: {
      groupAdminId: self?.id,
      uniqueGroupID: group?.uniqueGroupID!,
      name: group?.name!,
      description: group?.description,
      groupCover: group?.groupCover!,
    },
  });

  const newMemberAdded = await db.groupMember.create({
    data: {
      groupId: newGroup.id,
      userId: self?.id,
      color: color,
    },
  });

  console.log("Server action for group creation ", {
    newGroup,
    newMemberAdded,
  });

  revalidatePath("/chat");
  return newGroup;
};

export const onSendGroupMessage = async ({
  groupId,
  content,
}: {
  groupId: string;
  content: string;
}) => {
  const self = await getSelf();
  if (!self) {
    console.log("You have to be logged in to send group message");
    return null;
  }

  const isValidGroupMember = await db.groupMember.findFirst({
    where: {
      groupId,
      userId: self?.id,
    },
  });

  if (!isValidGroupMember) {
    console.log("You are not a member of this group, so cannot send message");
    return null;
  }

  const newGroupMessage = await db.groupMessage.create({
    data: {
      groupId: groupId,
      groupMessageContent: content,
      senderId: self?.id!,
    },
    include: {
      sender: true,
      group: true,
    },
  });

  console.log("Server action for group chat creation ", newGroupMessage);

  const targetGroup = await db.group.findUnique({
    where: {
      id: groupId,
    },
  });

  console.log("Sending group chat to channel ", targetGroup?.uniqueGroupID);

  pusherServer.trigger(
    targetGroup?.uniqueGroupID!,
    "new-group-message",
    newGroupMessage
  );
  return newGroupMessage;
};

export const initiateGroupRequest = async (groupId: string) => {
  const self = await getSelf();
  if (!self) {
    console.log("Unauthorised request");
    return null;
  }

  const request = await db.groupJoinRequest.create({
    data: {
      targetGroupId: groupId,
      requestSenderId: self?.id,
    },
  });

  revalidatePath("/chat");

  return request;
};

export const onApproveGroupJoinRequest = async ({
  group,
  user,
  color,
}: {
  group: Group;
  user: User;
  color: string;
}) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to accept request");
    return null;
  }

  const newMember = await db.groupMember.create({
    data: {
      userId: user.id,
      groupId: group.id,
      color: color,
    },
  });

  console.log("Server action for approving request ", newMember);

  const deletedRequest = await db.groupJoinRequest.deleteMany({
    where: {
      targetGroupId: group?.id,
      requestSenderId: user.id,
    },
  });

  if (deletedRequest.count === 0) {
    console.log("Request not found or already deleted");
    return null;
  }

  console.log("Server action for request deletion ", deletedRequest);
  revalidatePath("chat/group/requests");
  return newMember;
};

export const onRejectGroupJoinRequest = async ({
  group,
  user,
}: {
  group: Group;
  user: User;
}) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to deny requests");
    return null;
  }

  const deletedRequest = await db.groupJoinRequest.deleteMany({
    where: {
      targetGroupId: group?.id,
      requestSenderId: user.id,
    },
  });

  if (deletedRequest.count === 0) {
    console.log("Request not found or already deleted");
    return null;
  }

  console.log("Server action for denying request ", deletedRequest);
  revalidatePath("chat/group/requests");
  return deletedRequest;
};

export const onRemoveMember = async ({
  group,
  member,
}: {
  group: Group;
  member: User;
}) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to remove the user");
    return null;
  }

  const isAdminRequest = group.groupAdminId === self?.id;
  if (!isAdminRequest) {
    console.log("Unauthorised request");
    return null;
  }

  const memberDeleted = await db.groupMember.deleteMany({
    where: {
      groupId: group.id,
      userId: member.id,
    },
  });

  console.log("Server action for member removal ", memberDeleted);
  revalidatePath("/chat");
  revalidatePath(`/chat/group/${group.id}`);
  return memberDeleted;
};
