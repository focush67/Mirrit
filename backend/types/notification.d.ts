import { Post } from "../../types/post";
import { UserProfile } from "../../types/profile";

export interface Notification {
  type: "like" | "comment";
  from: UserProfile;
  to: UserProfile;
  post: Post;
  content?: string;
}
