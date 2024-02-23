"use client";

import { removeSavedPostState } from "@/redux_store/slices/saved/saved-slice";
import { removeSavedPost } from "@/server_actions/posts";
import { Button } from "@nextui-org/react";
import { Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
interface RemoveSavedProps {
  postId: string;
}

const RemoveSaved = ({ postId }: RemoveSavedProps) => {
  const [isPending, startTransition] = useTransition();

  const onRemovePost = () => {
    startTransition(() => {
      removeSavedPost(postId)
        .then(() => {
          toast.success("Post removed from cluster");
          removeSavedPostState({
            postId: postId,
          });
        })
        .catch(() => toast.error("Error removing post from cluster"));
    });
  };

  if (isPending) {
    return <Loader2Icon className="animate-spin" />;
  } else {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="text-xs"
        onClick={onRemovePost}
      >
        Remove
      </Button>
    );
  }
};

export default RemoveSaved;
