"use client";

import { Button } from "@nextui-org/react";
import { User } from "@prisma/client";

interface UnfollowButtonProps {
  profile: User;

  handleUnfollow: (profile: User) => void;
}

const UnfollowButton = ({ profile, handleUnfollow }: UnfollowButtonProps) => {
  return (
    <Button
      size="sm"
      variant="shadow"
      onClick={() => {
        handleUnfollow(profile);
      }}
    >
      Unfollow
    </Button>
  );
};

export default UnfollowButton;
