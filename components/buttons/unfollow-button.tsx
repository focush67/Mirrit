"use client";

import { Button } from "@nextui-org/react";
import { useTransition } from "react";
import { User } from "@prisma/client";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { onUnfollow } from "@/server_actions/follow";
import { removeRelationship } from "@/redux_store/slices/users/user-slice";
import { Loader } from "lucide-react";
interface UnfollowButtonProps {
  profile: User;
  visitor: User;
}

const UnfollowButton = ({ profile, visitor }: UnfollowButtonProps) => {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();

  const initiateUnfollow = () => {
    startTransition(() => {
      onUnfollow(profile.id)
        .then(() => {
          toast.success(`Unfollowed ${profile.username}`);
          dispatch(
            removeRelationship({
              initiator: visitor.id,
              target: profile.id,
            })
          );
        })
        .catch(() => toast.error(`Error unfollowing ${profile.username}`));
    });
  };

  if (isPending) {
    return <Loader className="animate-spin" />;
  } else {
    return (
      <Button size="sm" variant="shadow" onClick={initiateUnfollow}>
        Unfollow
      </Button>
    );
  }
};

export default UnfollowButton;
