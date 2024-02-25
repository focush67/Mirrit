"use client";

import React, { useTransition } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { Post } from "@prisma/client";
import { deletePost } from "@/server_actions/posts";
import toast from "react-hot-toast";
import { Trash2Icon } from "lucide-react";

interface DeleteModalProps {
  post: Post;
  onCloseDropDown?: () => void;
}

export default function DeleteModal({
  post,
  onCloseDropDown,
}: DeleteModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isPending, startTransition] = useTransition();

  const handlePostDeletion = () => {
    startTransition(() => {
      deletePost(post.id)
        .then(() => {
          toast.success(`Post was deleted successfully`);
        })
        .catch(() => toast.error(`Error occured in deletion`))
        .finally(() => {
          onClose();
          if (onCloseDropDown) {
            onCloseDropDown();
          }
        });
    });
  };

  return (
    <span className="w-3">
      <Button onPress={onOpen} className="bg-inherit" size="sm">
        <Trash2Icon className="w-4 h-4 " />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete this post ?
              </ModalHeader>
              <ModalBody className="flex items-center">
                <Image
                  src={post.cover}
                  height={100}
                  className="h-[200px]"
                  alt="Post Cover"
                />
                <p>This action is irreversible</p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-800 text-white"
                  disabled={isPending}
                  onClick={handlePostDeletion}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </span>
  );
}
