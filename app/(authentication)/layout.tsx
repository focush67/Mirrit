import { ReactNode } from "react";

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-6">
      {children}
    </div>
  );
}
