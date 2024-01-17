import { Saved } from "@/models/saved-posts-schema";
import { SavedPosts } from "@/types/state";

export default async function getUserSavedCluster() {
  try {
    const clusters: SavedPosts[] | null = await Saved.find();
    return clusters;
  } catch (error: any) {
    console.log("Error at getUserSavedCluster(): ", error.message);
    return null;
  }
}
