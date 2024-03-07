import { ChatProfileGroupCard } from "@/components/chat-components/groups-container";
import PendingRequests from "@/components/chat-components/pending-requests";
import {
  getRequestedGroups,
  getUnjoinedGroups,
} from "@/services/group-service";
import { Divider } from "@nextui-org/react";
import React from "react";
const ChatPageEnter = async () => {
  const allUnjoinedGroups = await getUnjoinedGroups();
  const allPendingRequests = await getRequestedGroups();
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <h1 className="text-2xl">All Groups</h1>
      <div className="ml-2 mt-2 mb-5 overflow-y-auto">
        <div className="ml-2 flex flex-col gap-x-2 gap-y-1 w-fit items-center">
          {allUnjoinedGroups?.map((grp, index) => (
            <ChatProfileGroupCard key={index} group={grp} isPending={false} />
          ))}
        </div>
      </div>
      <Divider />
      <h1 className="text-2xl">Pending Requests</h1>
      <div className="ml-2 mt-2 mb-5 overflow-y-auto">
        <div className="ml-2 flex flex-col gap-x-2 gap-y-1 w-fit items-center">
          {allPendingRequests?.map((grp, index) => (
            <ChatProfileGroupCard key={index} group={grp} isPending={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPageEnter;
