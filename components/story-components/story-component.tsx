"use client";
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import { LikeForStory, Story, User } from "@prisma/client";
import { Heart } from "lucide-react";
import { onLikeStory } from "@/server_actions/story";
import toast from "react-hot-toast";
import DeleteStory from "../buttons/delete-story";

interface StoryProps {
  stories: (Story & {
    owner: User;
    likes: LikeForStory[];
    status: boolean | undefined;
  })[];
  logged: User;
}

const Story = ({ stories, logged }: StoryProps) => {
  return (
    <section className="w-full h-[9vh] border-b-1 flex justify-center border-b-gray-500 bg-black fixed top-0 overflow-y-hidden overflow-x-auto">
      <ul className="flex gap-x-2 ml-2">
        {stories.map((story, index) => (
          <div className="mt-2 mb-4 ml-2" key={story.id}>
            <StoryComponent
              stories={stories}
              story={story}
              key={index}
              logged={logged}
            />
          </div>
        ))}
      </ul>
    </section>
  );
};

export default Story;

export const StoryComponent = ({
  stories,
  story,
  logged,
}: {
  stories: (Story & {
    owner: User;
    likes: LikeForStory[];
    status: boolean | undefined;
  })[];
  story: Story & {
    owner: User;
    likes: LikeForStory[];
    status: boolean | undefined;
  };
  logged: User;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [seen, setSeen] = useState(false);
  const [isPending, startTransition] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasLike, setHasLike] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handleStoryLike = () => {
    if (story.status === true) {
      onClose();
      return;
    }
    startTransition(true);
    onLikeStory(story)
      .then(() => {
        toast.success("Liked Story");
        setHasLike(true);
      })
      .catch(() => {
        onClose();
      });
  };

  useEffect(() => {
    let interval: any;
    if (isOpen) {
      const start = Date.now();
      interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - start;
        const duration = 10000; // Adjust this value for the duration of each story
        const percentage = (elapsedTime / duration) * 100;
        setProgress(percentage);

        if (elapsedTime >= duration) {
          onClose();
          setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        const timer = setTimeout(() => {
          onClose();
          setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
        }, 10000); // Adjust this value for the duration of each story
        return () => clearTimeout(timer);
      };
    }
  }, [currentStoryIndex, stories, onClose]);

  return (
    <div className="flex flex-col space-y-2 space-x-3">
      <div className="flex flex-col gap-y-1 gap-x-3 items-center">
        <Avatar
          src={story.owner.imageUrl!}
          onClick={onOpen}
          className="hover:cursor-pointer"
          isBordered
          color={seen ? "default" : "danger"}
          size="md"
        />
      </div>
      <Modal
        size="md"
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        className="w-fit h-fit"
        placement="bottom-center"
        radius="lg"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              {story.owner.username}
              {logged?.id === story.ownerId && <DeleteStory story={story} />}
            </ModalHeader>
            <ModalBody>
              <Image
                src={story.storyCover}
                alt="Story thumbnail here"
                width={500}
                height={400}
                ref={imageRef}
              />
              <p>{story.title}</p>
            </ModalBody>
            <ModalFooter className="flex items-center">
              <Heart
                className="w-5 h-5 hover:cursor-pointer"
                onClick={handleStoryLike}
                fill={hasLike || story.status ? "red" : "none"}
              />
              <Progress color="primary" className="h-2" value={progress} />
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};
