import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DankPass - Earn Points, Get Perks",
  description: "Upload receipts from dispensaries and restaurants to earn points and redeem amazing perks",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-dp-dark text-white overflow-hidden`}>
        <ErrorBoundary>
          <StackProvider>
            <StackTheme>
              <div className="h-full flex flex-col">
                {children}
              </div>
            </StackTheme>
          </StackProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
