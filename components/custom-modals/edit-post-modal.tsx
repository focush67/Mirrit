"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Post, User } from "@prisma/client";

import { useDispatch } from "react-redux";
import { editPost } from "@/redux_store/slices/posts/post-slice";
import { Edit3 } from "lucide-react";
import { onEditPost } from "@/server_actions/posts";
import toast from "react-hot-toast";

interface EditModalProps {
  post: Post & { owner: User };
}

export default function EditModal({ post }: EditModalProps) {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const stateDispatch = useDispatch();
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "title") {
      setTitle(value);
    }

    if (name === "description") {
      setDescription(value);
    }
  };

  const handlePostEdit = () => {
    startTransition(() => {
      onEditPost({
        id: post.id,
        title: title,
        description: description,
      }).then((data) => {
        toast.success(`Post edited!`);
        stateDispatch(
          editPost({
            id: post.id,
            editedPost: data!,
          })
        );
      });
    });
  };

  useEffect(() => {}, [stateDispatch]);

  return (
    <span className="w-auto">
      <Button onPress={onOpen} className="bg-inherit" size="sm">
        <Edit3 />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Post
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  name="title"
                  label="Title"
                  value={title}
                  placeholder="Edit Title"
                  variant="bordered"
                  onChange={handleChange}
                />
                <Textarea
                  name="description"
                  label="Description"
                  value={description!}
                  placeholder="Edit description"
                  type="text"
                  variant="bordered"
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={handlePostEdit}
                  disabled={isPending}
                >
                  Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </span>
  );
}
