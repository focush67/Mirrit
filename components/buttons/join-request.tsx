"use client";
import { initiateGroupRequest } from "@/server_actions/group";
import { Button } from "@nextui-org/react";
import { Group } from "@prisma/client";
import React, { useTransition } from "react";
import toast from "react-hot-toast";

interface JoinGroupRequestProps {
  targetGroup: Group;
}
const JoinGroupRequest = ({ targetGroup }: JoinGroupRequestProps) => {
  const [isPending, startTransition] = useTransition();

  const groupRequest = () => {
    startTransition(() => {
      initiateGroupRequest(targetGroup?.id)
        .then(() => {
          toast.success("Request sent");
        })
        .catch((error: any) => {
          console.log(error.message);
          toast.error("Could not generate request");
        });
    });
  };
  return (
    <div>
      <Button
        disabled={isPending}
        variant="ghost"
        color="primary"
        size="sm"
        onClick={groupRequest}
      >
        Request
      </Button>
    </div>
  );
};

export default JoinGroupRequest;
