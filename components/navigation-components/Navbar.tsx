"use client";

import React, { useEffect, useState } from "react";
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

interface NavigationProps {
  menuItems: string[];
  isLoggedIn: boolean;
}

export default function NavigationBar({
  menuItems,
  isLoggedIn,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentNotifications, setCurrentNotifications] = useState<
    NotificationsType[]
  >([]);

  const { user } = useUser();

  useEffect(() => {
    pusherClient.subscribe(`${user?.id}`);
    pusherClient.bind("like-notification", (data: NotificationsType) => {
      console.log(currentNotifications);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
      }
    });
    pusherClient.bind("comment-notification", (data: NotificationsType) => {
      console.log(currentNotifications);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
      }
    });
    pusherClient.bind("follow-notification", (data: NotificationsType) => {
      console.log("Follow notification ", data);
      if (
        !currentNotifications.some(
          (notification) => notification.id === data.id
        )
      ) {
        setCurrentNotifications((prev: NotificationsType[]) => [...prev, data]);
      }
    });
    return () => {
      pusherClient.unbind("comment-notification");
      pusherClient.unbind("like-notification");
      pusherClient.unbind("follow-notification");
      pusherClient.unsubscribe(`${user?.id}`);
    };
  }, [currentNotifications, user]);

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
            <div>({currentNotifications?.length})</div>
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
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
