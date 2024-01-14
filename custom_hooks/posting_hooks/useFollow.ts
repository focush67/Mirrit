import axios from "axios";
import { useEffect } from "react";

interface UseFollowProps {
  initiator: string;
  target: string;
  setIsFollowed: (isFollowed: boolean) => void;
}

export default function useFollow({
  initiator,
  target,
  setIsFollowed,
}: UseFollowProps) {
  useEffect(() => {
    const initiateFollowRequest = async () => {
      const response = await axios.post(
        `/api/follow/?initiator=${initiator}&target=${target}`
      );
      console.log(response.data);
      if (response.data.status === 201) {
        setIsFollowed(true);
      }
    };

    initiateFollowRequest();
  }, [initiator, target]);

  return;
}
