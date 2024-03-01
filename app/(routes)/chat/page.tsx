import GroupsContainer from "@/components/chat-components/groups-container";
import CreateGroupModal from "@/components/custom-modals/create-group-modal";
import React from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";

const ChatPageEnter = () => {
  return (
    <div className="flex mt-2 w-full h-full">
      <div className="w-3/4">
        <GroupsContainer />
      </div>

      <div className="flex justify-center">
        <CreateGroupModal />
        <div className="ml-4 mt-2">
          <Link href={`chat/group/requests`}>
            <Inbox />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatPageEnter;
