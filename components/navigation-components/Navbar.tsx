"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Link from "next/link";
import ToggleSwitch from "../switch/toggle-switch";
import { UserButton, useUser } from "@clerk/nextjs";
import { LoginButton } from "./navbar-component";
import { NotificationsType } from "../notification-components/notification-component";
import { pusherClient } from "@/utilities/pusher";
import { NotificationContext } from "@/context/notification-context";
import { BellDot } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavigationProps {
  menuItems: string[];
  isLoggedIn: boolean;
}

export default function NavigationBar({
  menuItems,
  isLoggedIn,
}: NavigationProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="w-auto h-15 fixed top-0 z-50"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          disabled={!isLoggedIn}
        />
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4 shadow-2xl">
        <NavbarItem>
          <Link href="/" className={`${isLoggedIn ? "block" : "hidden"}`}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem className={!isLoggedIn ? "hidden" : "block"}>
          <Link href="/dashboard">Dashboard</Link>
        </NavbarItem>
        <NavbarItem className={!isLoggedIn ? "hidden" : "block"}>
          <Link href={`/saved`}>Saved</Link>
        </NavbarItem>
        <NavbarItem className={!isLoggedIn ? "hidden" : "block"}>
          <Link href={"https://chatter-woad-nine.vercel.app/login"}>Chats</Link>
        </NavbarItem>
        <NavbarItem className={!isLoggedIn ? "hidden" : "block"}>
          <Link href="/notifications" className="flex items-center gap-x-1">
            <div>Notifications</div>
            <div>({notificationCount})</div>
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem
          className={`{
          } flex gap-x-1 md:hidden lg:hidden hover:cursor-pointer`}
        >
          <div>
            <BellDot
              fill={notificationCount! > 0 ? "red" : "white"}
              onClick={() => router.push("/notifications")}
            />
          </div>
          <div>{notificationCount}</div>
        </NavbarItem>
        <NavbarItem>
          {isLoggedIn ? <UserButton afterSignOutUrl="/" /> : <LoginButton />}
        </NavbarItem>
        <NavbarItem>
          <ToggleSwitch />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className={"flex items-center"}>
        {menuItems.map((item: string, index: number) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            {item === "Home" ? (
              <Link
                className="w-full capitalize"
                href={`/`}
                onClick={() => {
                  setIsMenuOpen(false);
                  return true;
                }}
              >
                {item}
              </Link>
            ) : (
              <Link
                className="w-full capitalize"
                href={`/${item}`}
                onClick={() => {
                  setIsMenuOpen(false);
                  return true;
                }}
              >
                {item}
              </Link>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
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
