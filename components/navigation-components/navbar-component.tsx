import React from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import NavigationBar from "./Navbar";
import { getSelf } from "@/services/auth-service";

const NavbarComponent = async () => {
  const self = await getSelf();
  const isLoggedIn = !!self;
  const loggedInMenuItems = ["Home", "dashboard", "saved", "chat"];

  const defaultMenuItems: string[] = [];

  const menuItems = isLoggedIn ? loggedInMenuItems : defaultMenuItems;
  return <NavigationBar menuItems={menuItems} isLoggedIn={isLoggedIn} />;
};

export default NavbarComponent;

export const LoginButton = () => {
  return (
    <SignInButton>
      <Button color="primary" size="sm" className="bg-green-600">
        Login
      </Button>
    </SignInButton>
  );
};
