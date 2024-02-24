"use client";

import React, { useState } from "react";
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
import { UserButton } from "@clerk/nextjs";
import { LoginButton } from "./navbar-component";

interface NavigationProps {
  menuItems: string[];
  isLoggedIn: boolean;
}

export default function NavigationBar({
  menuItems,
  isLoggedIn,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="w-full"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4 shadow-2xl">
        <NavbarItem>
          <Link href="/">Home</Link>
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
          <Link href="/recents">Recents</Link>
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
      <NavbarMenu className="flex items-center">
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
