import GroupsContainer from "@/components/chat-components/groups-container";
import CreateGroupModal from "@/components/custom-modals/create-group-modal";
import React from "react";

const ChatEnterPage = () => {
  return (
    <div className="flex justify-between mr-4 ml-4">
      <div className="w-full">
        <GroupsContainer />
      </div>
      <div className="mt-2 py-2">
        <CreateGroupModal />
      </div>
    </div>
  );
};

export default ChatEnterPage;
