"use client";

import {
  onApproveGroupJoinRequest,
  onRejectGroupJoinRequest,
} from "@/server_actions/group";
import { Avatar, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Group, User } from "@prisma/client";
import { Check, Trash } from "lucide-react";
import React, { useTransition } from "react";
import toast from "react-hot-toast";

interface JoinRequestCardProps {
  group: Group;
  user: User;
}

const JoinRequestCard = ({ group, user }: JoinRequestCardProps) => {
  const [isPending, startTransition] = useTransition();

  const approveRequest = () => {
    startTransition(() => {
      onApproveGroupJoinRequest({
        group,
        user,
      })
        .then(() => toast.success("Request Accepted"))
        .catch((error: any) => {
          console.log(error.message);
          toast.error("Error accepting request, check logs");
        });
    });
  };

  const denyRequest = () => {
    startTransition(() => {
      onRejectGroupJoinRequest({ group, user })
        .then(() => toast.success("Rejected request"))
        .catch((error: any) => {
          console.log(error.message);
          toast.error("Error rejecting request,check logs");
        });
    });
  };

  return (
    <Card className="w-[80vw] mt-2 mb-2">
      <CardHeader className="flex gap-x-2">
        <Avatar src={user?.imageUrl!} alt="User image" />
        <h1 className="text=md">{user?.username}</h1>
        <p>requested to join</p>
        <Avatar src={group?.groupCover} alt="Group Cover" />
        <p className="text-md">{group?.name}</p>
      </CardHeader>
      <CardBody>
        <div className="flex justify-end gap-x-2">
          <Button
            className="w-fit"
            color="success"
            disabled={isPending}
            onClick={approveRequest}
          >
            <Check />
          </Button>
          <Button
            className="w-fit bg-red-800"
            color="danger"
            disabled={isPending}
            onClick={denyRequest}
          >
            <Trash />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default JoinRequestCard;
