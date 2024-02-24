"use client";

import { Button } from "@nextui-org/react";
import { User } from "@prisma/client";
import { CircleSlash } from "lucide-react";

interface RemoveFollowerProps {
  profile: User;
  handleRemoveFollower: (profile: User) => void;
}

const RemoveFollower = ({
  profile,
  handleRemoveFollower,
}: RemoveFollowerProps) => {
  return (
    <Button
      color="primary"
      radius="full"
      size="sm"
      className="bg-red-800"
      onClick={() => {
        handleRemoveFollower(profile);
      }}
    >
      <CircleSlash />
    </Button>
  );
};

export default RemoveFollower;
