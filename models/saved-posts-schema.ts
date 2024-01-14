import { model, models, Schema } from "mongoose";
import { PostSchema } from "./post-schema";

const SavedPostsSchema = new Schema({
  email: { type: String, required: true },
  posts: [PostSchema],
});

export const Saved = models.Saved || model("Saved", SavedPostsSchema);
