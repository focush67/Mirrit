import { Post, User } from "@prisma/client";

export type T_Post = {
  post: Post;
  postedBy: User;
};
