"use client";

import React from "react";
import { Avatar } from "@nextui-org/react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
interface UserAvatarProps {
  user?: User;
  postOwner?: string;
  isDashboard?: boolean;
}

export default function UserAvatar({
  user,
  postOwner,
  isDashboard,
}: UserAvatarProps) {
  const router = useRouter();
  return (
    <div className="flex gap-3 items-center p-3 hover:cursor-pointer hover:scale-[1.1]">
      <Avatar
        src={user?.imageUrl!}
        size={isDashboard ? "sm" : "md"}
        onClick={() => {
          if (postOwner === user?.id) {
            console.log("Going to dashboard");
            router.push("/dashboard");
          } else {
            console.log(`Going to ${user?.username} profile`);
            router.push(`/${user?.username}`);
          }
        }}
      />
    </div>
  );
}
