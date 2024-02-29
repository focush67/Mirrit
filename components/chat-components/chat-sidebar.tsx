import React from "react";
import { User } from "@prisma/client";
import { Card, CardHeader, Avatar, Divider } from "@nextui-org/react";
import Link from "next/link";

import { db } from "@/utilities/database";
import { getSelf } from "@/services/auth-service";

const ChatSidebarProfiles = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("This page required authentication");
    return null;
  }
  const profiles = await db.user.findMany({
    where: {
      NOT: {
        id: self?.id,
      },
    },
  });

  return (
    <div className="overflow-y-auto flex flex-col h-1/2">
      <div className="space-y-2">
        <h1 className="mt-2 mb-2 text-center">Profiles</h1>
        {profiles.map((profile, index) => (
          <div key={profile.id} className="space-y-2">
            <ChatProfileCard key={index} chatProfile={profile} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebarProfiles;

export const ChatProfileCard = ({ chatProfile }: { chatProfile: User }) => {
  return (
    <Link href={`/chat/${chatProfile.id}`} className="hover:bg-[#3d3d3d]">
      <Card className="group w-auto hover:cursor-pointer bg-inherit">
        <CardHeader className="justify-center md:justify-between">
          <div className="flex gap-5 items-center">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={chatProfile?.imageUrl!}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="hidden md:text-xs md:font-semibold md:leading-none md:text-default-600 lg:block">
                {chatProfile.username}
              </h4>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};
