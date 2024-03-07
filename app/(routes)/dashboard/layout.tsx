import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col mt-0 pt-0 h-[105vh]">{children}</div>;
};

export default DashboardLayout;
