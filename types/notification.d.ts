import { Post } from "./post";
import { AuthProfile } from "./profile";

export interface Notification {
  post: Post;
  from: AuthProfile | null;
  type: "like" | "comment";
  to: AuthProfile | null;
  content?: string;
  _id?: string;
}
