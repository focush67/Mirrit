"use client";

import React, { useState, useTransition } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Input,
  Image,
} from "@nextui-org/react";
import { nanoid } from "nanoid";
import { onCreateGroup } from "@/server_actions/group";
import { Group } from "@prisma/client";
import toast from "react-hot-toast";
import { UploadDropZone } from "@/utilities/uploadthing";
import { Plus } from "lucide-react";
import randomColor from "randomcolor";

export default function CreateGroupModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPending, startTransition] = useTransition();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupCover, setGroupCover] = useState("");
  const [groupId, setGroupId] = useState("");
  const color = randomColor();

  const generateGroupID = () => {
    const randomId = nanoid(20);
    setGroupId(randomId);
  };

  const handleGroupCreation = () => {
    const group: Partial<Group> = {
      uniqueGroupID: groupId,
      name: groupName,
      description: groupDescription,
      groupCover: groupCover,
    };
    startTransition(() => {
      onCreateGroup({ group, color: color })
        .then(() => {
          toast.success(`Group created, you are the default Admin`);
          setGroupCover("");
          setGroupDescription("");
          setGroupName("");
          setGroupId("");
        })
        .catch((error: any) => {
          toast.error("Error creating a group");
          console.log(error.message);
        });
    });
  };
  return (
    <>
      <Button onPress={onOpen} variant="ghost" size="sm">
        <Plus className="w-6 h-6" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ml-1 space-y-1">
                <label className="text-md">Name</label>
                <Input
                  name="name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <label className="text-md">Description</label>
                <Input
                  name="description"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                />
              </ModalHeader>
              <ModalBody className="flex flex-row items-center">
                <Input
                  disabled
                  value={groupId}
                  className="pointer-events-none w-fit"
                />
                <Button
                  size="sm"
                  variant="solid"
                  color="success"
                  onClick={generateGroupID}
                  className="w-fit"
                >
                  Generate ID
                </Button>
              </ModalBody>

              <ModalFooter className="flex flex-col items-center">
                <label className="text-center">Upload Group Cover</label>
                {groupCover ? (
                  <Image
                    src={groupCover}
                    alt="Cover Image"
                    isZoomed
                    width={80}
                    height={20}
                  />
                ) : (
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
                      setGroupCover(res?.[0]?.url);
                    }}
                  ></UploadDropZone>
                )}

                <div className="flex gap-x-2">
                  <Button
                    color="danger"
                    variant="faded"
                    onPress={onClose}
                    disabled={isPending}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={onClose}
                    onClick={handleGroupCreation}
                    disabled={isPending}
                  >
                    Create
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
