"use client";

import { Button } from "@nextui-org/react";
import React from "react";

interface FollowButtonProps {
  handleFollow: () => void;
}

const FollowButton = ({ handleFollow }: FollowButtonProps) => {
  return (
    <Button color="primary" radius="full" size="sm" onClick={handleFollow}>
      Follow
    </Button>
  );
};

export default FollowButton;
