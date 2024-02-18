"use server";

import { Notification } from "@/models/notification-schema";
import { Profiles } from "@/models/user-profile-schema";
import { getServerSession } from "next-auth";
export const getNotifications = async () => {
  const session = await getServerSession();
  const id = await Profiles.findOne({ email: session?.user?.email });
  console.log({ session });
  try {
    const notifications = await Notification.find({ to: id._id });
    console.log("Notifications from server action ", notifications);
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
