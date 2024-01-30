import { Post } from "./post";
import { AuthProfile } from "./profile";

export interface Notification {
  post: Post;
  from: AuthProfile;
  type: "like" | "comment";
  to: AuthProfile;
}
