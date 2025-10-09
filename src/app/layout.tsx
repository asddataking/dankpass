import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { stackServerApp } from "@/stack";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dankpass.vercel.app'),
  title: "DankPass - Earn Free Weed & Restaurant Rewards | Upload Receipts, Get Perks",
  description: "Turn every receipt into rewards! Upload receipts from dispensaries and restaurants to earn points. Redeem for free weed, discounts, exclusive perks, and VIP access. Join 10K+ users earning rewards daily.",
  keywords: ["earn free weed", "cannabis rewards", "dispensary loyalty program", "restaurant rewards", "receipt upload", "earn points", "free perks", "loyalty app", "dispensary discounts"],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DankPass',
  },
  openGraph: {
    title: "DankPass - Earn Free Weed & Restaurant Rewards",
    description: "Upload receipts from dispensaries and restaurants to earn points. Redeem for free weed, discounts, and exclusive perks!",
    url: 'https://dankpass.vercel.app',
    siteName: 'DankPass',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'DankPass - Earn Free Weed & Rewards',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DankPass - Earn Free Weed & Restaurant Rewards",
    description: "Upload receipts from dispensaries and restaurants to earn points. Redeem for free weed, discounts, and exclusive perks!",
    images: ['/logo.png'],
  },
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
    <html lang="en">
      <body className={`${inter.className}`}>
        <ErrorBoundary>
          <StackProvider app={stackServerApp}>
            <StackTheme>
              {children}
            </StackTheme>
          </StackProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
