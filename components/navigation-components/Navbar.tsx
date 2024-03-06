"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import ToggleSwitch from "../switch/toggle-switch";
import { UserButton, useUser } from "@clerk/nextjs";
import { LoginButton } from "./navbar-component";
import { NotificationsType } from "../notification-components/notification-component";
import { pusherClient } from "@/utilities/pusher";
import { NotificationContext } from "@/context/notification-context";
import {
  BellDot,
  Bookmark,
  HomeIcon,
  MessageCircleIcon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Divider } from "@nextui-org/react";

interface NavigationProps {
  menuItems: string[];
  isLoggedIn: boolean;
}

export default function NavigationBar({ isLoggedIn }: NavigationProps) {
  const router = useRouter();
  const [currentNotifications, setCurrentNotifications] = useState<
    NotificationsType[]
  >([]);
  const { notificationCount, setNotificationCount } =
    useContext(NotificationContext) || {};
  const { user } = useUser();

  useEffect(() => {
    pusherClient.subscribe(`${user?.id}`);
    pusherClient.bind("like-notification", (data: NotificationsType) => {
      console.log(`like notification received from ${data.sender.username}`);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
        setNotificationCount?.((prev: number) => prev + 1);
        console.log("Count: ", notificationCount);
      }
    });
    pusherClient.bind("comment-notification", (data: NotificationsType) => {
      console.log(`comment notification received from ${data.sender.username}`);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
        setNotificationCount?.((prev: number) => prev + 1);
        console.log("Count: ", notificationCount);
      }
    });
    pusherClient.bind("follow-notification", (data: NotificationsType) => {
      console.log(`follow notification received from ${data.sender.username}`);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
        setNotificationCount?.((prev: number) => prev + 1);
        console.log("Count: ", notificationCount);
      }
    });
    return () => {
      pusherClient.unbind("comment-notification");
      pusherClient.unbind("like-notification");
      pusherClient.unbind("follow-notification");
      pusherClient.unsubscribe(`${user?.id}`);
    };
  }, [currentNotifications, user, notificationCount]);

  return (
    <>
      <footer className="p-4 flex items-center justify-center fixed bottom-0 w-full z-50 bg-black text-white border-t-2 border-gray-500">
        <div className="w-3/4 flex justify-evenly gap-x-2">
          <div>
            <Link href="/" className={`${isLoggedIn ? "block" : "hidden"}`}>
              <HomeIcon />
            </Link>
          </div>
          <div className={!isLoggedIn ? "hidden" : "block"}>
            <Link href="/dashboard">
              <User />
            </Link>
          </div>
          <div className={!isLoggedIn ? "hidden" : "block"}>
            <Link href={`/saved`}>
              <Bookmark />
            </Link>
          </div>
          <div className={!isLoggedIn ? "hidden" : "block"}>
            <Link href={"/chat"}>
              <MessageCircleIcon />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <div
            className={`{
          } flex gap-x-1 md:hidden lg:hidden hover:cursor-pointer`}
            onClick={() => router.push("/notifications")}
          >
            <BellDot
              className="w-6 h-6"
              fill={notificationCount! > 0 ? "red" : "white"}
            />
            <span>{notificationCount}</span>
          </div>
          <div>{!isLoggedIn && <LoginButton />}</div>
          <div>
            <ToggleSwitch />
          </div>
        </div>
      </footer>
    </>
  );
}

interface BadgeProps {
  children: React.ReactNode;
}

export const BadgeComponent = ({ children }: BadgeProps) => {
  return (
    <div className="ml-2 relative inline-block">
      <div className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1 leading-none absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
};
