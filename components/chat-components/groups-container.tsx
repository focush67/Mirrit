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
    <div className="w-full">
      <div className="ml-2 mt-2 mb-2 overflow-x-auto max-h-[30vh] w-full">
        <div className="ml-2 flex flex-wrap gap-x-2 gap-y-1 w-fit items-center">
          {allUnjoinedGroups?.map((grp, index) => (
            <ChatProfileGroupCard key={index} group={grp} isPending={false} />
          ))}
        </div>
      </div>

      <Divider />

      <div className="ml-2 mt-2 mb-2 overflow-x-auto max-h-[30vh] w-full">
        <div className="ml-2 mt-2 mb-2 overflow-x-auto max-h-[30vh] w-full">
          <div className="ml-2 flex flex-wrap gap-x-2 gap-y-1 w-fit items-center">
            {allRequestedGroups?.map((grp, index) => (
              <ChatProfileGroupCard key={index} group={grp} isPending={true} />
            ))}
          </div>
        </div>
      </div>

      <Divider />

      <div className="ml-2 overflow-x-auto min-h-[10vh] w-auto">
        <h1 className="text-center mt-3 mb-2">Joined Groups</h1>
        <div className="ml-2 flex flex-wrap gap-x-2 gap-y-1 w-fit">
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
  let linkHref = `/chat/group/${group.id}`;
  let linkDisabled = false;

  if (isPending) {
    linkDisabled = true;
  } else if (!hasJoinedTheGroup) {
    linkDisabled = true;
  }
  return (
    <Card className="w-auto shadow-2xl bg-auto">
      <CardHeader className="flex gap-3">
        <Link
          className="hover:cursor-pointer"
          href={linkDisabled ? "/chat" : linkHref}
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
