import { getSelf } from "@/services/auth-service";
import {
  getJoinedGroups,
  getRequestedGroups,
  getUnjoinedGroups,
} from "@/services/chat-service";
import { Card, CardHeader, Avatar, Divider } from "@nextui-org/react";
import { Group } from "@prisma/client";
import Link from "next/link";
import React from "react";
import JoinGroupRequest from "../buttons/join-request";
import { checkMembership } from "@/services/group-service";

const GroupsContainer = async () => {
  const allUnjoinedGroups = await getUnjoinedGroups();
  const allRequestedGroups = await getRequestedGroups();
  const allJoinedGroups = await getJoinedGroups();

  return (
    <div>
      <div className="max-h-[40vh] overflow-y-auto min-h-[10vh] relative">
        <div className="text-center mb-2 mt-2 sticky-top-0">All Groups</div>
        <div className="flex flex-col gap-y-2 overflow-y-auto">
          {allUnjoinedGroups?.map((grp, index) => (
            <>
              <ChatProfileGroupCard key={index} group={grp} isPending={false} />
            </>
          ))}
        </div>
      </div>

      <Divider />
      <div className="max-h-[30vh] overflow-y-auto min-h-[10vh] relative">
        <div className="text-center mr-5 sticky top-0">Pending</div>
        <div className="flex flex-col gap-y-1 overflow-y-auto mt-6">
          {allRequestedGroups?.map((grp, index) => (
            <>
              <ChatProfileGroupCard key={index} group={grp} isPending={true} />
            </>
          ))}
        </div>
      </div>

      <Divider />
      <div className="max-h-[30vh] overflow-y-auto min-h-[10vh] relative">
        <h1 className="text-center mb-2 mt-2 sticky top-0">Joined Groups</h1>
        <div className="flex flex-col gap-y-2 overflow-y-auto">
          {allJoinedGroups?.map((grp, index) => (
            <>
              <ChatProfileGroupCard key={index} group={grp} isPending={false} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupsContainer;

export const ChatProfileGroupCard = async ({
  group,
  isPending,
}: {
  group: Group;
  isPending: boolean;
}) => {
  const self = await getSelf();
  const hasJoinedTheGroup = await checkMembership(group.id);
  return (
    <Card className="w-auto bg-inherit">
      <CardHeader className="flex gap-3">
        <Link className="hover:cursor-pointer" href={`/chat/group/${group.id}`}>
          <Avatar radius="sm" src={group?.groupCover!} />
        </Link>
        <div className="flex flex-col">
          <p className="text-xs">{group.name}</p>
        </div>
        {group.groupAdminId !== self?.id ? (
          isPending === true ? (
            <div className="text-xs text-yellow-700">Request Pending</div>
          ) : (
            !hasJoinedTheGroup && <JoinGroupRequest targetGroup={group} />
          )
        ) : null}
      </CardHeader>
    </Card>
  );
};
