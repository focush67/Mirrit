import mongoose, { model, models, Schema } from "mongoose";
import { Profiles } from "./user-profile-schema";

const NotificationSchema = new Schema({
  type: { type: String, required: true },
  from: { type: mongoose.Types.ObjectId, required: true, ref: "Profiles" },
  to: { type: mongoose.Types.ObjectId, required: true, ref: "Profiles" },
  post: { type: mongoose.Types.ObjectId, required: true, ref: "Posts" },
});

export const Notification =
  models.Notification || model("Notification", NotificationSchema);

NotificationSchema.methods.getProfilebyEmail = async function (field: string) {
  try {
    const profile = await Profiles.find({ email: this[field] });
    if (!profile) {
      return {};
    }
    return profile;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
