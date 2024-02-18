"use client";

import { removeCommentFromPost } from "@/redux_store/slices/posts/post-slice";
import { Post } from "@/types/post";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { Minus } from "lucide-react";
import { ElementRef } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface DeleteCommentProps {
  post: Post;
  requestedBy: string;
  commentId: string;
}

const DeleteComment = ({
  post,
  requestedBy,
  commentId,
}: DeleteCommentProps) => {
  const dispatch = useDispatch();
  const handleCommentDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/posts/comment/?requestedBy=${requestedBy}&commentId=${commentId}&postId=${post._id}`
      );
      console.log(response.data);
      if (response.data.status === 200) {
        toast.success("Comment deleted");
        dispatch(
          removeCommentFromPost({
            commentId: commentId,
            postId: post._id,
          })
        );
      } else if (response.data.status !== 201) {
        toast.error("Some error occured while deleting comment");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCommentDelete}
      className="rounded-lg"
    >
      <Minus className="h-4 w-4" />
    </Button>
  );
};

export default DeleteComment;
