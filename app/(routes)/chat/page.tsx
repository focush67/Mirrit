import GroupsContainer from "@/components/chat-components/groups-container";
import CreateGroupModal from "@/components/custom-modals/create-group-modal";
import React from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";

const ChatPageEnter = () => {
  return (
    <div className="flex mt-2 h-full justify-between">
      <div className="w-1/2 pr-2">
        <GroupsContainer />
      </div>
      <div className="w-1/2 pl-2 flex flex-col justify-between">
        <div className="flex gap-x-2 items-center">
          <CreateGroupModal />
          <Link href={`chat/group/requests`}>
            <Inbox />
          </Link>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ChatPageEnter;
