import { onCreateStory } from "@/server_actions/story";
import { UploadDropZone } from "@/utilities/uploadthing";
import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Image } from "@nextui-org/react";

export const StoryModal = ({ ownerId }: { ownerId: string }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => {
      onCreateStory({
        title: title,
        storyCover: cover,
        ownerId: ownerId,
      })
        .then(() => {
          toast.success("Added to story");
          onClose();
        })
        .catch(() => toast.error("Error Adding to story"));
    });
  };

  return (
    <>
      <Button onPress={onOpen} variant="bordered" size="sm">
        Story
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create a Story
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col justify-center"
                  onSubmit={onSubmit}
                >
                  <Input
                    autoFocus
                    name="title"
                    label="Title"
                    placeholder="Enter title of post"
                    variant="bordered"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <div>
                    <div className="flex items-center justify-center">
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
                      {cover && (
                        <div className="mt-2 mb-2 flex items-center">
                          <Image
                            isLoading={isPending}
                            src={cover}
                            width={200}
                            height={200}
                            alt="Thumbnail"
                            className="rounded-xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={title.length === 0 || isPending}
                    variant="ghost"
                  >
                    Create Story
                  </Button>
                </form>
              </ModalBody>
              <Button
                className="text-red-700"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
