import ChatSidebarProfiles from "@/components/chat-components/chat-sidebar";
import React, { ReactNode } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { Metadata } from "next";
import CreateGroupModal from "@/components/custom-modals/create-group-modal";
import { Divider } from "@nextui-org/react";
import JoinedGroups from "@/components/chat-components/joined-groups-sidebar-container";

export const metadata: Metadata = {
  title: "Chat",
  description: "Here is the chat page",
};

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="py-1 mt-1 flex w-full h-full">
      <div className="p-2 border-r h-screen">
        <div className="overflow-y-auto flex flex-col justify-between items-center h-full">
          <div className="h-3/4 mb-4 overflow-y-auto p-1">
            <ChatSidebarProfiles />
            <Divider />
            <JoinedGroups />
            <Divider className="mt-2" />
          </div>
          <div className="my-auto mb-[5rem] flex gap-x-2 items-center gap-y-5 mt-4 justify-center">
            <CreateGroupModal />
            <Link href={`chat/group/requests`}>
              <Inbox />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ChatLayout;
