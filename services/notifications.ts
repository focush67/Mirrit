import { db } from "@/utilities/database";
import { getSelf } from "./auth-service";

export const getNotifications = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("No notifications were returned as the user is not signed in");
    return [];
  }
  const notifications = await db.notification.findMany({
    where: {
      receiverId: self.id,
    },
    include: {
      receiver: true,
      sender: true,
      post: true,
    },
  });
  return notifications;
};
