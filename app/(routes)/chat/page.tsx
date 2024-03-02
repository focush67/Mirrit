import GroupsContainer from "@/components/chat-components/groups-container";
import React from "react";
const ChatPageEnter = () => {
  return (
    <div className="flex mt-2">
      <div className="w-full pr-2">
        <GroupsContainer />
      </div>
    </div>
  );
};

export default ChatPageEnter;
