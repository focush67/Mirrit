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
import { Edit2, Edit3 } from "lucide-react";
import { onEditPost } from "@/server_actions/posts";
import toast from "react-hot-toast";
import { UploadDropZone } from "@/utilities/uploadthing";
import Image from "next/image";

interface EditModalProps {
  post: Post & { owner: User };
}

export default function EditModal({ post }: EditModalProps) {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const stateDispatch = useDispatch();
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [cover, setCover] = useState(post.cover);

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
        cover: cover,
      }).then((data) => {
        toast.success(`Post edited!`);
        console.log(data);
        stateDispatch(
          editPost({
            id: post.id,
            editedPost: data,
          })
        );
      });
    });
  };

  useEffect(() => {}, [stateDispatch]);

  return (
    <span className="w-auto">
      <Button onPress={onOpen} className="bg-inherit" size="sm">
        <Edit2 className="w-4 h-4" />
      </Button>
      <Modal
        isOpen={isOpen}
        className="max-w-[70vw]"
        onOpenChange={onOpenChange}
        placement="center"
        size="sm"
      >
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
                <div className="flex flex-row items-center justify-center">
                  <div className={`rounded-xl outline-muted mb-4`}>
                    <div className="flex  md:flex-row lg:flex-row gap-x-2 items-center justify-center gap-y-2">
                      {cover && (
                        <div className="mt-2">
                          <Image
                            src={cover}
                            width={150}
                            height={150}
                            alt="Thumbnail"
                            className="rounded-xl max-h-[350px] object-cover"
                          />
                        </div>
                      )}
                      <div className="w-1/2 md:w-1/4 border-1 border-dashed rounded-lg">
                        <UploadDropZone
                          endpoint="thumbnailUploader"
                          className="b ut-label:hidden ut-button:size-auto ut-button:text-xs md:ut-label:text-lg md:ut-button:size-10 md:ut-button:text-lg ut-button:mt-6"
                          appearance={{
                            label: {
                              color: "#fff",
                            },
                            allowedContent: {
                              color: "#fff",
                            },
                          }}
                          onClientUploadComplete={(res) => {
                            setCover(res?.[0]?.url);
                          }}
                        ></UploadDropZone>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center gap-x-2">
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
