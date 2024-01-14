"use client";

import React from "react";
import { Avatar } from "@nextui-org/react";
import { Post } from "@/types/post";
import { useRouter } from "next/navigation";
interface UserAvatarProps {
  user?: Post;
  src?: string;
}

export default function UserAvatar({ user, src }: UserAvatarProps) {
  const router = useRouter();
  return (
    <div
      className="flex gap-3 items-center p-3 hover:cursor-pointer hover:scale-[1.1]"
      onClick={() => router.push(`/${user?.email}`)}
    >
      {user || src ? (
        <Avatar src={user?.image || src} />
      ) : (
        <Avatar name="Junior" />
      )}
    </div>
  );
}
