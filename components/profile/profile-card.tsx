"use client";
import React, { useState, useTransition } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
} from "@nextui-org/react";
import { Follow, User } from "@prisma/client";
import PostUploadModal from "../post-components/upload-modal";
import EditBioModal from "../custom-modals/edit-bio-modal";
import Link from "next/link";
import { UploadDropZone } from "@/utilities/uploadthing";
import { onCreateStory } from "@/server_actions/story";
import toast from "react-hot-toast";

interface ProfileCardProps {
  profile:
    | (User & {
        following: Follow[];
        followedBy: Follow[];
      })
    | null;
}

export default async function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="w-full flex justify-center md:justify-center mt-2">
      <Card className="w-full m-2 items-center shadow-2xl">
        <CardHeader className="flex justify-between">
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={profile?.imageUrl!}
              className="hover:cursor-pointer"
            />

            <div className="flex flex-col gap-1 items-start justify-between">
              <h4 className="text-xs font-semibold leading-none text-default-600">
                {profile?.username}
              </h4>
              <span className={`text-xs tracking-tight text-default-400 mr-3`}>
                {profile?.bio || "This is the bio"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StoryModal ownerId={profile?.id!} />
            <EditBioModal initialBio={profile?.bio} />
            <PostUploadModal />
          </div>
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <span className="pt-2"></span>
        </CardBody>
        <CardFooter className="gap-3">
          <Link
            href={`/following`}
            className={`group flex gap-1 ${
              profile?.following.length === 0
                ? "pointer-events-none"
                : "hover:cursor-pointer hover:font-bold transition-all delay-75"
            }`}
          >
            <p className="font-semibold text-default-400 text-small">
              {profile?.following?.length}
            </p>
            <p className="text-default-400 text-small">Following</p>
          </Link>
          <Link
            href={`/followers`}
            className={`group flex gap-1 ${
              profile?.followedBy.length === 0
                ? "pointer-events-none"
                : "hover:cursor-pointer hover:font-bold transition-all delay-75"
            }`}
          >
            <p className="font-semibold text-default-400 text-small hover:cursor-pointer">
              {profile?.followedBy?.length}
            </p>
            <p className="text-default-400 text-small">Followers</p>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

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
