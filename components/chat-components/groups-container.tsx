import { getJoinedGroups } from "@/services/chat-service";
import { Card, CardHeader, Avatar } from "@nextui-org/react";
import { Group } from "@prisma/client";
import Link from "next/link";
import React from "react";

const GroupsContainer = async () => {
  const groupsJoined = await getJoinedGroups();
  return (
    <div>
      <h1 className="text-center mb-2 mt-2">Groups</h1>
      <div className="flex flex-col gap-y-2 overflow-y-auto">
        {groupsJoined?.map((grp, index) => (
          <>
            <ChatProfileGroupCard key={index} group={grp} />
          </>
        ))}
      </div>
    </div>
  );
};

export default GroupsContainer;

export const ChatProfileGroupCard = ({ group }: { group: Group }) => {
  return (
    <Link
      className="hover:cursor-pointer hover:bg-[#3d3d3d]"
      href={`/chat/group/${group.id}`}
    >
      <Card className="w-auto bg-inherit">
        <CardHeader className="flex gap-3">
          <Avatar radius="sm" src={group?.groupCover!} />
          <div className="flex flex-col">
            <p className="text-xs">{group.name}</p>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};
