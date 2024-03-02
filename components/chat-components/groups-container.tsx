import { getSelf } from "@/services/auth-service";
import {
  getJoinedGroups,
  getRequestedGroups,
  getUnjoinedGroups,
} from "@/services/group-service";
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
      <div className="ml-2 h-[25vh] overflow-x-auto min-h-[10vh] w-auto">
        <h1 className="text-center mt-3 mb-2">All Groups</h1>
        <div className="ml-2 flex gap-x-2 overflow-x-auto w-fit items-center">
          {allUnjoinedGroups?.map((grp, index) => (
            <ChatProfileGroupCard key={index} group={grp} isPending={false} />
          ))}
        </div>
      </div>

      <Divider />
      <div className="ml-2 h-[25vh] overflow-x-auto min-h-[10vh] w-auto">
        <div className="text-center mt-3 mb-2">Pending</div>
        <div className="ml-2 flex gap-y-1 gap-x-2 overflow-x-auto w-fit mt-6">
          {allRequestedGroups?.map((grp, index) => (
            <ChatProfileGroupCard key={index} group={grp} isPending={true} />
          ))}
        </div>
      </div>

      <Divider />
      <div className="ml-2 max-h-[30vh] overflow-x-auto min-h-[10vh] w-auto py-3">
        <h1 className="text-center mt-3 mb-2">Joined Groups</h1>
        <div className="ml-2 flex gap-x-2 overflow-x-auto w-fit">
          {allJoinedGroups?.map((grp, index) => (
            <ChatProfileGroupCard key={index} group={grp} isPending={false} />
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
    <Card className="w-fit shadow-2xl bg-auto">
      <CardHeader className="flex gap-3">
        <Link
          className="hover:cursor-pointer"
          href={`/chat/group/${group.id}`}
          aria-disabled={isPending}
        >
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
