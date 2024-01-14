import { Post } from "./post";
import { UserProfile } from "./profile";

export interface GlobalState {
  globals: any;
  posts: Post[];
  users: UserProfile[];
  saved: Post[];
}
