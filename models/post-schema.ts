import { models, model, Schema } from "mongoose";

const CommentSchema = new Schema({
  content: { type: String },
  user: { type: String },
  image: { type: String },
  user_email: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export const PostSchema = new Schema(
  {
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    userName: { type: String },
    tags: [{ type: String }],
    cover: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [CommentSchema],
    shares: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Posts = models.Posts || model("Posts", PostSchema);
