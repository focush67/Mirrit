import { Comment, User } from "@prisma/client";

export type T_Comment = Comment & {
  commentor: User;
};
