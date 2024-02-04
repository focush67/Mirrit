import Notification from "@/components/notifications/notifications-container";
import React from "react";
import { getServerSession } from "next-auth";

const NotificationsContainer = async () => {
  const session = await getServerSession();
  console.log("Server Session: ", session);
  return (
    <div>
      <Notification />
    </div>
  );
};

export default NotificationsContainer;
