"use client";
import {
  onApproveGroupJoinRequest,
  onRejectGroupJoinRequest,
} from "@/server_actions/group";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { Group, User } from "@prisma/client";
import { Check, Trash } from "lucide-react";
import React, { useTransition } from "react";
import toast from "react-hot-toast";

interface JoinRequestCardProps {
  group: Group;
  user: User;
  color: string;
}

const JoinRequestCard = ({ group, user, color }: JoinRequestCardProps) => {
  const [isPending, startTransition] = useTransition();

  const approveRequest = () => {
    startTransition(() => {
      onApproveGroupJoinRequest({
        group,
        user,
        color,
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
          toast.error("Error rejecting request, check logs");
        });
    });
  };

  return (
    <Card className="w-fit mt-2 mb-2">
      <CardHeader className="flex items-center">
        <Avatar src={user?.imageUrl!} alt="User image" />
        <div className="ml-2">
          <h1 className="text-md">{user?.username}</h1>
          <p className="text-xs">wants to join</p>
        </div>
      </CardHeader>

      <CardFooter className="flex items-center">
        <Avatar src={group?.groupCover} alt="Group Cover" />
        <p className="text-md ml-2">{group?.name}</p>
      </CardFooter>

      <CardBody>
        <div className="flex justify-end gap-x-2">
          <Button
            className="w-fit"
            color="success"
            disabled={isPending}
            onClick={approveRequest}
            size="sm"
          >
            <Check />
          </Button>
          <Button
            className="w-fit bg-red-800"
            color="danger"
            disabled={isPending}
            onClick={denyRequest}
            size="sm"
          >
            <Trash />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default JoinRequestCard;
