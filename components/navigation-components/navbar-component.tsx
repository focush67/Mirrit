import React from "react";
import { SignInButton, UserButton, currentUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import NavigationBar from "./Navbar";

const NavbarComponent = async () => {
  const self = await currentUser();
  const isLoggedIn = !!self;
  const loggedInMenuItems = ["Home", "dashboard", "saved", "messenger"];

  const defaultMenuItems = ["Home"];

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
