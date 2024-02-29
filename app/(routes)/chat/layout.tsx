import ChatSidebarProfiles from "@/components/chat-components/chat-sidebar";
import React, { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeftFromLine } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description: "Here is the chat page",
};

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="py-8 mt-8 flex w-full h-full">
      <div className="p-2 border-r h-screen">
        <div className="overflow-y-auto">
          <ChatSidebarProfiles />
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ChatLayout;

export const ChatExit = () => {
  return (
    <Link href={"/chat"} className="flex mt-2 justify-center">
      <div className="flex items-center space-x-2 cursor-pointer">
        <ArrowLeftFromLine />
      </div>
    </Link>
  );
};
