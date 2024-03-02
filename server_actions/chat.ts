"use server";

import { getSelf } from "@/services/auth-service";
import { db } from "@/utilities/database";
import { pusherServer } from "@/utilities/pusher";

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
