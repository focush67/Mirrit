"use client";

import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { commentOnPost } from "@/redux_store/slices/posts/post-slice";
import toast from "react-hot-toast";
import { AuthProfile } from "@/types/profile";
import { useSocket } from "@/experiments/socket-context";
import { NotificationContext } from "@/experiments/notification-context";
import { saveNotification } from "@/server_actions/saveNotification";

interface CommentSectionProps {
  currentPost: Post;
  from: AuthProfile | null;
  to: AuthProfile | null;
}

let CommentSection = ({ currentPost, from, to }: CommentSectionProps) => {
  const { socket } = useSocket();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [presentComment, setPresentComment] = useState<string>("");
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { setNotifications } = useContext(NotificationContext) || {};

  useEffect(() => {
    socket?.on("comment-added", (response) => {
      setNotifications?.((prev) => {
        const newSet = new Set([...Array.from(prev), response.info]);

        return newSet;
      });
    });
  }, [socket]);

  const handleCommentUploadMemo = useCallback(async () => {
    if (!session) {
      toast.error("Login required");
      return;
    }

    if (presentComment.length <= 0) {
      toast.error("Comment is empty");
      return;
    }

    const composedComment: Comment = {
      user: session?.user?.name!,
      user_email: session?.user?.email!,
      image: session?.user?.image!,
      content: presentComment,
    };

    try {
      const response = await axios.post(
        `/api/posts/comment/?id=${currentPost._id}`,
        {
          comment: composedComment,
        }
      );
      dispatch(
        commentOnPost({
          _id: currentPost._id,
          comment: composedComment,
        })
      );

      socket?.emit("send-notification", {
        type: "comment",
        from: from,
        to: to,
        post: currentPost,
        content: presentComment,
      });
      toast.success("Comment Added");
      const res = await saveNotification({
        type: "comment",
        from,
        to,
        post: currentPost,
      });
      console.log("server action response for comment ", res);
      setPresentComment("");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Some error occured");
    }
  }, [session, presentComment, currentPost, dispatch]);

  return (
    <div className="flex items-center justify-center ">
      <Button onPress={onOpen}>
        <MessageCircle />
        <p>{currentPost.comments.length}</p>
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
                {currentPost.title}
              </ModalHeader>
              <ModalBody>
                {currentPost.comments.map((comment: Comment, index: number) => (
                  <IndividualComment
                    comment={comment}
                    key={index}
                    post={currentPost}
                    requestedBy={session?.user?.email!}
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
                  onClick={handleCommentUploadMemo}
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
