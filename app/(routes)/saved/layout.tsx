import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-xl font-semibold w-full">Saved Posts</h1>
      <div className="flex justify-center items-center overflow-hidden mt-2">
        {children}
      </div>
    </div>
  );
};

export default Layout;
