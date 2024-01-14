import { model, models, Schema } from "mongoose";

const AuthUserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
});

const ProfileSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  followers: [AuthUserSchema],
  following: [AuthUserSchema],
});

export const Profiles = models.Profiles || model("Profiles", ProfileSchema);
