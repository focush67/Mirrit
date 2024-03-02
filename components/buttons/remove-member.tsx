"use client";

import { onRemoveMember } from "@/server_actions/group";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { User, Group } from "@prisma/client";
import { Trash } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface RemoveMemberProps {
  member: User;
  group: Group;
}

const RemoveMember = ({ member, group }: RemoveMemberProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPending, startTransition] = useTransition();
  const initiateMemberRemoval = () => {
    startTransition(() => {
      onRemoveMember({ group, member })
        .then(() => {
          toast.success("Memer successfully removed");
        })
        .catch((error: any) => {
          toast.error("Some error occured while removing member");
          console.log(error.message);
        });
    });
  };

  return (
    <>
      <Button onPress={onOpen} size="sm">
        <Trash />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Remove this member ?
              </ModalHeader>
              <ModalBody>
                <Card>
                  <CardHeader className="gap-x-2">
                    <Avatar src={member?.imageUrl!} />
                    <p>{member.username}</p>
                  </CardHeader>
                </Card>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  disabled={isPending}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={initiateMemberRemoval}
                  disabled={isPending}
                >
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default RemoveMember;
