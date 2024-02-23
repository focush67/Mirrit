"use client";

import { removeRelationship } from "@/redux_store/slices/users/user-slice";
import { onRemoveFollower } from "@/server_actions/follow";
import { Button } from "@nextui-org/react";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface RemoveFollowerProps {
  profileId: string;
  ownerId: string;
}

const RemoveFollower = ({ ownerId, profileId }: RemoveFollowerProps) => {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const handleFollowerRemoval = () => {
    startTransition(() => {
      onRemoveFollower(profileId)
        .then(() => {
          toast.success("Removed Follower");
          dispatch(
            removeRelationship({
              initiator: ownerId,
              target: profileId,
            })
          );
        })
        .catch(() => toast.error("Error removing follower"));
    });
  };

  if (isPending) {
    return <Loader className="animate-spin" />;
  } else {
    return (
      <Button
        color="primary"
        radius="full"
        size="sm"
        className="bg-red-800"
        onClick={handleFollowerRemoval}
      >
        Remove
      </Button>
    );
  }
};

export default RemoveFollower;
