import { Metadata } from "next";
import React, { ReactNode } from "react";
export const metadata: Metadata = {
  title: "Group Chat",
  description: "Here you can chat to your groups",
};
const GroupLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default GroupLayout;
