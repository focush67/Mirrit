"use server";

import { Notification as NotifType } from "@/types/notification";
import { Notification } from "@/models/notification-schema";
export const saveNotification = async ({
  type,
  from,
  to,
  content,
  post,
}: NotifType) => {
  console.log({ type, from, to, content, post });
  try {
    const newNotif = await Notification.create({
      type,
      from: from?._id,
      to: to?._id,
      post: post._id,
      content,
    });
    await newNotif.save();
    return newNotif as NotifType;
  } catch (error: any) {
    console.log("Error at notification server action ", error.message);
    return null;
  }
};
