import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-4 text-center my-5">
      <h1 className="text-xl font-semibold w-full">Saved Posts</h1>
      {children}
    </div>
  );
};

export default Layout;
