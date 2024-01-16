import mongoose, { model, models, Schema } from "mongoose";

const SavedPostsSchema = new Schema({
  email: { type: String, required: true },
  posts: [{ type: mongoose.Types.ObjectId }],
});

export const Saved = models.Saved || model("Saved", SavedPostsSchema);
