"use client";

import React from "react";
import { Avatar } from "@nextui-org/react";
import { Post } from "@/types/post";
interface UserAvatarProps {
  user?: Post;
  src?: string;
  onClick?: () => void;
}

export default function UserAvatar({ user, src, onClick }: UserAvatarProps) {
  return (
    <div
      className="flex gap-3 items-center p-3 hover:cursor-pointer hover:scale-[1.1]"
      onClick={onClick && onClick}
    >
      {user || src ? (
        <Avatar src={user?.image || src} />
      ) : (
        <Avatar name="Junior" />
      )}
    </div>
  );
}
