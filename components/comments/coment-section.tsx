"use client";

import React, { useState } from "react";
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
import { Post } from "@/types/post";
import { Comment } from "@/types/comment";
import IndividualComment from "./individual-comment";
import useFetchCurrentComments from "@/custom_hooks/fetching_hooks/useFetchCurrentComments";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { commentOnPost } from "@/redux_store/slices/global-slices";
import toast from "react-hot-toast";

interface CommentSectionProps {
  currentPost: Post;
}

export default function CommentSection({ currentPost }: CommentSectionProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [presentComment, setPresentComment] = useState<string>("");
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const handleCommentUpload = async () => {
    if (!session) {
      alert("Please Login to continue");
      return;
    }

    if (presentComment.length <= 0) {
      alert("Comment is empty");
      return;
    }

    const composedComment: Comment = {
      user: session?.user?.name!,
      user_email: session?.user?.email!,
      image: session?.user?.image!,
      content: presentComment,
    };

    dispatch(
      commentOnPost({
        _id: currentPost._id,
        comment: composedComment,
      })
    );

    try {
      const response = await axios.post(
        `/api/posts/comment/?id=${currentPost._id}`,
        {
          comment: composedComment,
        }
      );

      console.log(response.data);
      toast.success("Comment Added");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Some error occured");
    }
  };
  return (
    <div className="flex items-center justify-center w-[20px]">
      <Button onPress={onOpen}>
        <MessageCircle />
        <p>{currentPost.comments.length}</p>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {currentPost.title}
              </ModalHeader>
              <ModalBody>
                {currentPost.comments.map((comment: Comment) => (
                  <IndividualComment comment={comment} />
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
                  onClick={handleCommentUpload}
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
}
