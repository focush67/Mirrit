import GroupChatArea from "@/components/chat-components/group-chat-area";
import GroupChatInput from "@/components/chat-components/group-chat-input";
import { getSelf } from "@/services/auth-service";
import { db } from "@/utilities/database";
import { Avatar, Divider } from "@nextui-org/react";
import { format } from "date-fns";
import React from "react";

interface GroupPageProps {
  params: {
    groupId: string;
  };
}

const SpecificGroupChatPage = async ({ params }: GroupPageProps) => {
  const { groupId } = params;
  const self = await getSelf();
  const specificGroup = await db.group.findUnique({
    where: {
      id: groupId,
    },
  });

  const initialGroupChatMessages = await db.groupMessage.findMany({
    where: {
      id: groupId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const groupChannel = specificGroup?.uniqueGroupID;

  const formatTimeStamp = (time: Date) => {
    return format(time, "dd/MM/yyyy HH:mm");
  };

  return (
    <div>
      <div className="flex gap-x-2 space-y-1 items-center p-1">
        <Avatar src={specificGroup?.groupCover} size="md" />
        <h1>{specificGroup?.name}</h1>
        <div className="hidden md:flex gap-x-3">
          <p className="text-xs">
            Created At {formatTimeStamp(new Date(specificGroup?.createdAt!))}
          </p>
          <p className="text-xs">Admin: {specificGroup?.groupAdminId}</p>
        </div>
      </div>
      <Divider />
      <div className="pt-5">
        <GroupChatArea
          initialMessages={initialGroupChatMessages}
          groupChannel={groupChannel!}
          sessionId={self?.id!}
        />
      </div>
      <div>
        <GroupChatInput groupId={groupId} />
      </div>
    </div>
  );
};

export default SpecificGroupChatPage;
