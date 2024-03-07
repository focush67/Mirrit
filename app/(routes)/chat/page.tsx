import { ChatProfileGroupCard } from "@/components/chat-components/groups-container";
import { getUnjoinedGroups } from "@/services/group-service";
import React from "react";
const ChatPageEnter = async () => {
  const allUnjoinedGroups = await getUnjoinedGroups();
  return (
    <div className="flex flex-col items-center justify-center mt-2">
      <h1 className="text-2xl">All Groups</h1>
      <div className="ml-2 mt-2 mb-2 overflow-y-auto">
        <div className="ml-2 flex flex-col gap-x-2 gap-y-1 w-fit items-center">
          {allUnjoinedGroups?.map((grp, index) => (
            <ChatProfileGroupCard key={index} group={grp} isPending={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPageEnter;
