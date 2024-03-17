import { getSelf } from "@/services/auth-service";
import { Card, CardHeader, Avatar } from "@nextui-org/react";
import { Group } from "@prisma/client";
import Link from "next/link";
import React from "react";
import JoinGroupRequest from "../buttons/join-request";
import { checkMembership } from "@/services/group-service";

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
    <Card className="w-full shadow-2xl bg-inherit hover:bg-background">
      <CardHeader className="flex gap-3">
        <Link
          className="hover:cursor-pointer"
          href={linkDisabled ? "/chat" : linkHref}
        >
          <Avatar radius="sm" src={group?.groupCover!} />
        </Link>
        {group.groupAdminId !== self?.id ? (
          isPending === true ? (
            <div className="text-xs text-yellow-700">Request Pending</div>
          ) : (
            !hasJoinedTheGroup && <JoinGroupRequest targetGroup={group} />
          )
        ) : null}
        <h4 className="hidden md:text-xs md:font-semibold md:leading-none md:text-default-600 lg:block">
          {group?.name}
        </h4>
      </CardHeader>
    </Card>
  );
};
