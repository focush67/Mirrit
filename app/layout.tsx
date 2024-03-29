import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/ui-provider";
import ReduxProvider from "@/providers/store-provider";
import NavbarComponent from "@/components/navigation-components/navbar-component";
import { ToastProvider } from "@/providers/toast-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NotificationProvider } from "@/context/notification-context";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mirrit",
  description: "Made with Next14 and TypeScript",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={inter.className}>
          <NotificationProvider>
            <ReduxProvider>
              <ToastProvider>
                <Providers>
                  {children}
                  <NavbarComponent />
                </Providers>
              </ToastProvider>
            </ReduxProvider>
          </NotificationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
