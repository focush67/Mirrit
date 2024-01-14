import { Post } from "./post";
import { UserProfile } from "./profile";

export interface GlobalState {
  posts: Post[];
  users: UserProfile[];
}
