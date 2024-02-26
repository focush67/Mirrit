import Notifications from "./page";
import { getNotifications } from "@/services/notifications";

const NotificationLayout = async () => {
  const previousNotifications = await getNotifications();
  return (
    <div>
      <Notifications notifications={previousNotifications} />
    </div>
  );
};

export default NotificationLayout;
