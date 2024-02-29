"use client";

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
import toast from "react-hot-toast";
import { UploadDropZone } from "@/utilities/uploadthing";
import { useState, useTransition } from "react";
import { createPost } from "@/server_actions/posts";
import Image from "next/image";

const PostUploadModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cover, setCover] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "title") {
      setTitle(e.target.value);
    } else if (e.target.name === "description") {
      setDescription(e.target.value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => {
      createPost({
        title,
        description,
        cover,
      })
        .then(() => {
          toast.success(`Post Uploaded`);
        })
        .catch(() => {
          toast.error(`Error in uploading post`);
        })
        .finally(() => {
          setTitle("");
          setDescription("");
          setCover("");
          onClose();
        });
    });
  };

  return (
    <>
      <Button variant="shadow" size="sm" color="primary" onPress={onOpen}>
        New
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create a Post
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={onSubmit}
                  className="flex flex-col items-center gap-2"
                >
                  <Input
                    autoFocus
                    name="title"
                    label="Title"
                    placeholder="Enter title of post"
                    variant="bordered"
                    value={title}
                    onChange={onChange}
                  />
                  <Textarea
                    name="description"
                    label="Description"
                    placeholder="Enter description"
                    type="text"
                    variant="bordered"
                    value={description}
                    onChange={onChange}
                  />

                  <div className="flex flex-row items-center justify-center">
                    <div className={`rounded-xl outline-muted mb-4`}>
                      {!cover && (
                        <UploadDropZone
                          endpoint="thumbnailUploader"
                          appearance={{
                            label: {
                              color: "#fff",
                            },
                            allowedContent: {
                              color: "#ffff",
                            },
                          }}
                          onClientUploadComplete={(res) => {
                            setCover(res?.[0]?.url);
                          }}
                        ></UploadDropZone>
                      )}
                    </div>
                    {cover && (
                      <div className="mt-2">
                        <Image
                          src={cover}
                          width={200}
                          height={200}
                          alt="Thumbnail"
                          className="rounded-xl"
                        />
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={isPending} color="primary">
                    Post
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostUploadModal;
