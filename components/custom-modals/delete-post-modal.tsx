import React from "react";
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
import { Trash } from "lucide-react";
import { Post } from "@/types/post";

interface DeleteModalProps {
  post: Post;
  handleDelete: (id: string) => void;
}

export default function DeleteModal({ post, handleDelete }: DeleteModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>
        <Trash />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete this post ?
              </ModalHeader>
              <ModalBody className="flex items-center">
                <Image src={post.cover} width={300} alt="Post Cover" />
                <p>This action is irreversible</p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="warning" onClick={() => handleDelete(post._id)}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
