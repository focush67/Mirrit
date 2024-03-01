import GroupChatArea from "@/components/chat-components/group-chat-area";
import GroupChatInput from "@/components/chat-components/group-chat-input";
import GroupInfo from "@/components/chat-components/group-info-modal";
import { getSelf } from "@/services/auth-service";
import { getProfilesInGroup } from "@/services/chat-service";
import { getUserById } from "@/services/user-service";
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

  const admin = await getUserById(specificGroup?.groupAdminId!);
  const groupChannel = specificGroup?.uniqueGroupID;

  // const formatTimeStamp = (time: Date) => {
  //   return format(time, "dd/MM/yyyy HH:mm");
  // };

  const groupMembers = await getProfilesInGroup(groupId);

  return (
    <div>
      <div className="flex gap-x-2 space-y-3 items-center justify-between p-2 mr-2">
        <div className="flex gap-x-2 items-center">
          <Avatar src={specificGroup?.groupCover} size="md" />
          <h1>{specificGroup?.name}</h1>
        </div>
        <GroupInfo
          group={specificGroup!}
          members={groupMembers!}
          admin={admin!}
        />
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
