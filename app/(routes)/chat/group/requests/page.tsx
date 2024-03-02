import JoinRequestCard from "@/components/chat-components/join-request-card";
import { getJoinRequests } from "@/services/group-service";
import { ArrowLeftFromLine } from "lucide-react";
import randomColor from "randomcolor";
import Link from "next/link";

const GroupJoinReq = async () => {
  const requests = await getJoinRequests();
  const color = randomColor();
  return (
    <div className="flex flex-col items-center justify-start mt-5">
      <div className="flex items-center justify-between w-full">
        <Link href={"/chat"} className="ml-4">
          <ArrowLeftFromLine />
        </Link>
        <h1 className="text-2xl">Pending Requests</h1>
        <div className="w-6"></div>
      </div>
      <div className="mt-10">
        {requests?.length === 0 && <div>No pending requests</div>}
      </div>

      {requests?.map((request, index) => (
        <JoinRequestCard
          key={index}
          group={request.targetGroup}
          user={request.requestSender}
          color={color}
        />
      ))}
    </div>
  );
};

export default GroupJoinReq;
