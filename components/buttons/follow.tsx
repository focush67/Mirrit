"use client";

import { addRelationship } from "@/redux_store/slices/global-slices";
import { Button } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface FollowButtonProps {
  targetUser: string;
  initiatorUser: string;
  setStatus: (status: boolean) => void;
}

const Follow = ({
  targetUser,
  initiatorUser,
  setStatus,
}: FollowButtonProps) => {
  const dispatch = useDispatch();
  const followUser = async () => {
    try {
      const response = await axios.post(
        `/api/follow/?initiator=${initiatorUser}&target=${targetUser}`
      );
      if (response.data.status !== 301) {
        console.log("Dispatching Follow");
        dispatch(
          addRelationship({
            initiator: initiatorUser,
            target: targetUser,
          })
        );

        toast.success("Followed");
        setStatus(true);
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error("Some error occured while following");
    }
  };
  return (
    <Button color="primary" size="sm" variant="flat" onClick={followUser}>
      Follow
    </Button>
  );
};

export default Follow;
