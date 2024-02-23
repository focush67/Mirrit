"use client";

import { updateUser } from "@/server_actions/user";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { LucideClipboardEdit } from "lucide-react";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface EditBioProps {
  initialBio: string | null | undefined;
}
const EditBioModal = ({ initialBio }: EditBioProps) => {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [bio, setBio] = useState(initialBio);

  const handleChangingBio = () => {
    startTransition(() => {
      updateUser({
        bio: bio,
      })
        .then(() => toast.success("Bio Updated"))
        .catch(() => toast.error("Error updating bio"));
    });
  };

  return (
    <span className="w-auto">
      <Button onPress={onOpen} className="bg-inherit" size="sm">
        <LucideClipboardEdit />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Bio
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  name="bio"
                  label="Bio"
                  value={bio || ""}
                  placeholder="Edit Bio"
                  variant="bordered"
                  onChange={(e: any) => setBio(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={handleChangingBio}
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
};

export default EditBioModal;
