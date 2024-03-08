import { Comment, User } from "@prisma/client";
import { Card, Avatar } from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";

interface CommentProps {
  comment: Comment & { commentor: User };
}

export const CommentCard = ({ comment }: CommentProps) => {
  const formattedTime = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="w-auto flex flex-col justify-between gap-4 mt-2 p-4">
      <div className="flex flex-row items-center justify-between">
        <Avatar src={comment?.commentor?.imageUrl!} size="md" alt="Avatar" />
        <p className="text-small font-semibold">{comment.content}</p>
        <p className="text-gray-500 text-xs">{formattedTime}</p>
      </div>
    </Card>
  );
};
