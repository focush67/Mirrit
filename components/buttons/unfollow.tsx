"use client";

import { removeRelationship } from "@/redux_store/slices/global-slices";
import { Button } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface UnfollowButtonProps {
  targetUser: string;
  initiatorUser: string;
  setStatus: (status: boolean) => void;
}

const UnfollowButton = ({
  targetUser,
  initiatorUser,
  setStatus,
}: UnfollowButtonProps) => {
  const dispatch = useDispatch();
  const unfollowUser = async () => {
    try {
      const response = await axios.post(
        `/api/unfollow/?initiator=${initiatorUser}&target=${targetUser}`
      );
      if (response.data.status === 200) {
        console.log("Dispatching Unfollow");
        dispatch(
          removeRelationship({
            initiator: initiatorUser,
            target: targetUser,
          })
        );

        toast.success("Unfollowed");
        setStatus(false);
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error("Some error occured while unfollowing");
    }
  };
  return (
    <Button
      color="secondary"
      size="sm"
      variant="bordered"
      onClick={unfollowUser}
    >
      Unfollow
    </Button>
  );
};

export default UnfollowButton;
