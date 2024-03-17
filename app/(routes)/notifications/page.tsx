import Notifications from "@/components/notification-components/notification-component";
import { getNotifications } from "@/services/notifications";

const NotificationLayout = async () => {
  const previousNotifications = await getNotifications();
  return <Notifications notifications={previousNotifications} />;
};

export default NotificationLayout;
