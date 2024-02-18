import Notification from "@/components/notifications/notifications-container";
import React from "react";
import { getNotifications } from "@/server_actions/getNotifications";

const NotificationsContainer = async () => {
  const notifications = await getNotifications();
  console.log({ notifications });
  return (
    <div>
      <Notification />
    </div>
  );
};

export default NotificationsContainer;
