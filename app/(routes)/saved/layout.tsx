import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mt-2 mb-2 space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Saved Posts</h2>
      <div className="flex justify-center items-center overflow-hidden mt-2">
        {children}
      </div>
    </div>
  );
};

export default Layout;
