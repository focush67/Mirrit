import ChatArea from "@/components/chat-components/chat-area";
import ChatInput from "@/components/chat-components/chat-input";
import { getSelf } from "@/services/auth-service";
import { db } from "@/utilities/database";
import { Avatar, Divider } from "@nextui-org/react";

interface SpecificChatProps {
  params: {
    chatId: string;
  };
}

const SpecificChat = async ({ params }: SpecificChatProps) => {
  const { chatId } = params;
  const self = await getSelf();
  const chatPartner = await db.user.findUnique({
    where: {
      id: chatId,
    },
  });
  const initialMessages = await db.message.findMany({
    where: {
      messageReceiverId: chatId,
      messageSenderId: self?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const chatChannel = self?.externalUserId!;
  return (
    <div>
      <div className="flex gap-x-2 space-y-1 items-center p-1">
        <Avatar src={chatPartner?.imageUrl!} size="md" />
        <h1>{chatPartner?.username}</h1>
      </div>
      <Divider />
      <div className="pt-5">
        <ChatArea
          initialMessages={initialMessages}
          chatChannel={chatChannel}
          sessionId={self?.id!}
        />
      </div>
      <div>
        <ChatInput chatPartner={chatPartner!} />
      </div>
    </div>
  );
};

export default SpecificChat;
