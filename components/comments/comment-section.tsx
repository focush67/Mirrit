"use client";

import React, { useState, memo, useTransition } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import InputBar from "../input/input-bar";
import { Post } from "@prisma/client";
import IndividualComment from "./individual-comment";
import { MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { commentOnPost } from "@/redux_store/slices/posts/post-slice";
import toast from "react-hot-toast";
import { CommentOnPost } from "@/server_actions/interactions";
import { StateType } from "@/redux_store/store";
import { T_Comment } from "@/types/comment";
import { PostType } from "@/types/post";
interface CommentSectionProps {
  post: Post;
  existingComments: T_Comment[];
  loggedInUserId: string | undefined;
}

let CommentSection = ({
  post,
  existingComments,
  loggedInUserId,
}: CommentSectionProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [presentComment, setPresentComment] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();
  const statePost = useSelector((state: StateType) =>
    state.posts.posts.find((p: PostType) => p.id === post.id)
  );
  const handleCommenting = () => {
    startTransition(() => {
      CommentOnPost({ postId: post.id, content: presentComment })
        .then((data) => {
          toast.success(`Comment added`);
          dispatch(
            commentOnPost({
              id: post.id,
              comment: data!,
            })
          );
          setPresentComment("");
        })
        .catch(() => toast.error(`Error adding comment`))
        .finally(() => onClose());
    });
  };

  return (
    <div className="flex items-center justify-center">
      <Button onPress={onOpen}>
        <MessageCircle />
        <p>{statePost?.comments?.length}</p>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={"inside"}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {statePost?.title}
              </ModalHeader>
              <ModalBody>
                {statePost?.comments?.map((comment: any, index: number) => (
                  <IndividualComment
                    comment={comment}
                    key={index}
                    post={post}
                    loggedInUserId={loggedInUserId}
                  />
                ))}
              </ModalBody>
              <ModalFooter className="items-center">
                <InputBar
                  presentComment={presentComment}
                  setPresentComment={setPresentComment}
                />
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={handleCommenting}
                  disabled={isPending}
                >
                  Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default memo(CommentSection);
