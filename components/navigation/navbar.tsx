"use client";

import React, { useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";

import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import ToggleSwitch from "../switch/toggle-switch";
import { signIn } from "next-auth/react";
import UserAvatar from "../profile/user-avatar";
import axios from "axios";

export default function NavigationBar() {
  const { data: session } = useSession();
  const [register, setRegister] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    const isAlreadyRegistered = async () => {
      const response = await axios.post("/api/register", {
        email: session?.user?.email,
        userName: session?.user?.name,
        image: session?.user?.image,
      });
      if (response.data.status === 303) setRegister(true);
    };

    isAlreadyRegistered();
  }, []);

  const loggedInMenuItems = [
    <UserAvatar src={session?.user?.image!} />,
    <Link href={"/profile"}>Profile</Link>,
    <Link href={"/dashboard"}>Dashboard</Link>,
    <Link href={"/messenger"}>Messenger</Link>,
    <Button
      variant="shadow"
      onClick={() => signOut()}
      className={session ? "flex" : "hidden"}
    >
      Logout
    </Button>,
  ];

  const defaultMenuItems = [
    <Link href={"/users"}>Users</Link>,
    <Button
      as={Link}
      color="success"
      href="#"
      variant="ghost"
      className={`${
        session ? "hidden" : "inherit"
      } hover:text-white hover:bg-green-700 font-semibold`}
      onClick={() => signIn("google")}
    >
      Login
    </Button>,
  ];

  const registerUser = async () => {
    const response = await axios.post("/api/register", {
      email: session?.user?.email,
      userName: session?.user?.name,
      image: session?.user?.image,
    });
    if (response.data.status === 303) setRegister(true);
  };

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent
        className="sm:hidden pr-3"
        justify="center"
      ></NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4">
        <NavbarBrand></NavbarBrand>
        <NavbarItem>
          <Link href="/">Home</Link>
        </NavbarItem>
        <NavbarItem className={!session ? "hidden" : "block"}>
          <Link href="/dashboard">Dashboard</Link>
        </NavbarItem>
        <NavbarItem className={!session ? "hidden" : "block"}>
          <Link href="/messenger">Messenger</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex"></NavbarItem>
        <NavbarItem className="flex items-center gap-3">
          {session ? (
            <>
              <UserAvatar src={session?.user?.image!} />{" "}
              <Button variant="ghost" onClick={() => signOut()}>
                Logout
              </Button>{" "}
            </>
          ) : (
            <Button
              color="success"
              variant="ghost"
              className={`${
                session ? "hidden" : "inherit"
              } hover:text-white hover:bg-green-700 font-semibold`}
              onClick={() => signIn("google")}
            >
              Login
            </Button>
          )}

          <Button
            className={register || !session ? "hidden" : "flex"}
            onClick={registerUser}
          >
            Verify Email
          </Button>

          <ToggleSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="flex items-center">
        {session
          ? loggedInMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link className="w-full" href="#">
                  {item}
                </Link>
              </NavbarMenuItem>
            ))
          : defaultMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link className="w-full text-black" href="#">
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
      </NavbarMenu>
    </Navbar>
  );
}
