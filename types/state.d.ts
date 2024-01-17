import { Post } from "./post";
import { UserProfile } from "./profile";

export interface GlobalState {
  globals: any;
  posts: Post[];
  users: UserProfile[];
  saved: SavedPosts | null;
  status: string;
}

export interface SavedPosts {
  email: string;
  posts: string[];
}
