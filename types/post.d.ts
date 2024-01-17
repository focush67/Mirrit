import { Comment } from "./comment";

export interface Post {
  _id: any;
  email: string;
  title: string;
  description: string;
  image: string;
  userName: string;
  tags: string[];
  cover: string;
  likes: number;
  comments: Comment[];
  shares: number;
  createdAt?: any;
  updatedAt?: any;
}
