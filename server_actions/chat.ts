"use server";

import { getSelf } from "@/services/auth-service";
import { db } from "@/utilities/database";
import { pusherServer } from "@/utilities/pusher";
import { Group } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const onSendMessage = async ({
  content,
  receiverId,
}: {
  content: string;
  receiverId: string;
}) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to send messages , returning");
    return null;
  }

  const receiver = await db.user.findUnique({
    where: {
      id: receiverId,
    },
  });

  if (!receiver) {
    console.log("Receiver of message not found");
    return null;
  }

  const newMessage = await db.message.create({
    data: {
      messageSenderId: self?.id,
      messageReceiverId: receiverId,
      messageContent: content,
    },
  });

  const targetChannels = [self?.externalUserId, receiver.externalUserId];
  console.log(`Sending chat message`);
  pusherServer.trigger(targetChannels, "new-message", newMessage);

  return newMessage;
};

export const onCreateGroup = async ({ group }: { group: Partial<Group> }) => {
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

  const isValidGroupMember = await db.groupMember.findUnique({
    where: {
      id: groupId,
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
    },
  });

  console.log("Server action for group chat creation ", newGroupMessage);
  pusherServer.trigger(
    newGroupMessage?.groupId,
    "new-group-message",
    newGroupMessage
  );
  return newGroupMessage;
};
