"use client";

import { onDeleteStory } from "@/server_actions/story";
import { Button } from "@nextui-org/react";
import { Story } from "@prisma/client";
import { Trash } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface DeleteStoryProps {
  story: Story;
}

const DeleteStory = ({ story }: DeleteStoryProps) => {
  const [isPending, startTransition] = useTransition();
  const handleStoryDelete = () => {
    startTransition(() => {
      onDeleteStory(story.id)
        .then(() => {
          toast.success("Story deleted");
        })
        .catch((error: any) => {
          console.log("Error deleting story,check logs");
          console.log(error.message);
        });
    });
  };
  return (
    <Button disabled={isPending} onClick={handleStoryDelete} variant="ghost">
      <Trash />
    </Button>
  );
};

export default DeleteStory;
