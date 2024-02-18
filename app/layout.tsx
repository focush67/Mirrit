import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/ui-provider";
import SessionProvider from "@/providers/session-provider";
import ReduxProvider from "@/providers/store-provider";
import { getServerSession } from "next-auth";
import NavigationBar from "@/components/navigation/navbar";
import { ToastProvider } from "@/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social App",
  description: "Made with Next14 and TypeScript",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <Providers>
            <SessionProvider session={session}>
              <ReduxProvider>
                <NavigationBar />
                {children}
              </ReduxProvider>
            </SessionProvider>
          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}
