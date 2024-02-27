"use client";

import { onLikeStory } from "@/server_actions/story";
import {
  Avatar,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { LikeForStory, Story, User } from "@prisma/client";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface StoryProps {
  stories: (Story & {
    owner: User;
    likes: LikeForStory[];
    status: boolean | undefined;
  })[];
}

const Story = ({ stories }: StoryProps) => {
  return (
    <section className="md:flex flex-col">
      <div className="flex items-center">
        <ul>
          {stories.map((story, index) => (
            <div className="mt-2 mb-4" key={story.id}>
              <StoryComponent story={story} key={index} />
            </div>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Story;

export const StoryComponent = ({
  story,
}: {
  story: Story & {
    owner: User;
    likes: LikeForStory[];
    status: boolean | undefined;
  };
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [seen, setSeen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [hasLike, setHasLike] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleStoryLike = () => {
    if (story.status === true) {
      onClose();
      return;
    }
    startTransition(() => {
      onLikeStory(story)
        .then(() => {
          toast.success("Liked Story");
          setHasLike(true);
          onClose();
        })
        .catch(() => {
          onClose();
        });
    });
  };

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        onClose();
      }, 10000);
      setSeen(true);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        const timer = setTimeout(() => {
          onClose();
        }, 10000);
        return () => clearTimeout(timer);
      };
    }
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex gap-x-3 items-center">
        <Avatar
          src={story.owner.imageUrl!}
          onClick={onOpen}
          className="hover:cursor-pointer"
          isBordered
          color={seen ? "default" : "danger"}
          size="md"
        />
        <p className="hidden md:block md:text-xs lg:text-xs">
          {story.owner.username}
        </p>
      </div>
      <Modal
        size="full"
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        className="w-auto h-fit rounded-full"
        placement="center"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              {story.owner.username}
            </ModalHeader>
            <ModalBody>
              <Image
                src={story.storyCover}
                alt="Story thumbnail here"
                width={200}
                height={200}
                ref={imageRef}
              />
              <p>{story.title}</p>
            </ModalBody>
            <ModalFooter>
              <Heart
                className="w-5 h-5 hover:cursor-pointer"
                onClick={handleStoryLike}
                fill={hasLike || story.status ? "red" : "none"}
              />
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};
