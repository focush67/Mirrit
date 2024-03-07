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
    <div className="h-screen flex flex-col">
      <div className="flex gap-x-2 space-y-3 items-center  justify-between p-2 mr-2 h-fit">
        <div className="flex gap-x-2 items-center">
          <Avatar src={chatPartner?.imageUrl!} size="md" />
          <h1 className="text-md">{chatPartner?.username}</h1>
        </div>
      </div>
      <Divider />
      <div className="h-[79%] overflow-y-auto">
        <ChatArea
          initialMessages={initialMessages}
          chatChannel={chatChannel!}
          sessionId={self?.id!}
        />
      </div>
      <div className="mb-[4rem]">
        <ChatInput chatPartner={chatPartner!} />
      </div>
    </div>
  );
};

export default SpecificChat;
