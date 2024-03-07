import { getJoinedGroups } from "@/services/group-service";
import React from "react";
import { ChatProfileGroupCard } from "./groups-container";

const JoinedGroups = async () => {
  const allJoinedGroups = await getJoinedGroups();
  return (
    <div className="ml-2 overflow-y-auto min-h-[10vh] w-fit mb-3">
      <h1 className="text-center mt-3 mb-2 font-semibold">Joined Groups</h1>
      <div className="flex flex-wrap gap-x-2 gap-y-2 w-fit items-center justify-center">
        {allJoinedGroups?.map((grp, index) => (
          <ChatProfileGroupCard key={index} group={grp} isPending={false} />
        ))}
      </div>
    </div>
  );
};

export default JoinedGroups;
