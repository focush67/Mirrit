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
import { PlusCircleIcon } from "lucide-react";

export const StoryModal = ({ ownerId }: { ownerId: string }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [storyTitle, setStoryTitle] = useState("");
  const [storyCover, setStoryCover] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Submitting");
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => {
      onCreateStory({
        title: storyTitle,
        storyCover: storyCover,
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
      <PlusCircleIcon onClick={onOpen} className="mt-1" />
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
                    name="story-title"
                    label="Title"
                    placeholder="Enter title of story"
                    variant="bordered"
                    value={storyTitle}
                    required
                    onChange={(e) => setStoryTitle(e.target.value)}
                  />

                  <div>
                    <div className="flex items-center justify-center">
                      {!storyCover && (
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
                            setStoryCover(res?.[0]?.url);
                          }}
                        ></UploadDropZone>
                      )}
                      {storyCover && (
                        <div className="mt-2 mb-2 flex items-center">
                          <Image
                            isLoading={isPending}
                            src={storyCover}
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
                    disabled={storyTitle.length === 0 || isPending}
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
