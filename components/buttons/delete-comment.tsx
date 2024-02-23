"use client";

import { removeCommentFromPost } from "@/redux_store/slices/posts/post-slice";
import { Button } from "@nextui-org/react";
import { Loader, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useTransition } from "react";
import { deleteComment } from "@/server_actions/interactions";
import { Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { T_Comment } from "@/types/comment";

interface DeleteCommentProps {
  comment: T_Comment;
  post: Post;
  commentOwner: string;
}

const DeleteComment = ({ comment, post, commentOwner }: DeleteCommentProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCommentDeletion = () => {
    startTransition(() => {
      deleteComment(comment.id)
        .then(() => {
          toast.success("Comment deleted");
          dispatch(
            removeCommentFromPost({
              commentId: comment.id,
              postId: post.id,
            })
          );
          router.refresh();
        })
        .catch(() => toast.error("Comment successfully deleted"));
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCommentDeletion}
      className="rounded-lg"
      disabled={isPending}
    >
      {isPending ? (
        <Loader className="animate-spin h-4 w-4" />
      ) : (
        <Minus className="h-4 w-4" />
      )}
    </Button>
  );
};

export default DeleteComment;
