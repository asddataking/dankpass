import type { Metadata } from "next";
import { Outfit, Manrope } from "next/font/google";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { stackServerApp } from "@/stack";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
});

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dankpass.vercel.app'),
  title: "DankPass - Earn Free Weed | Upload Receipts & Burn Rewards",
  description: "Earn free weed with every receipt! Upload receipts from dispensaries and restaurants to earn points. Burn points for free weed, discounts, and exclusive perks. Join 10K+ users earning and burning rewards daily. Start earning free weed today!",
  keywords: ["earn free weed", "free weed rewards", "dispensary rewards program", "cannabis loyalty points", "get free weed with receipts", "earn and burn", "burn points for weed", "free cannabis rewards", "receipt upload rewards", "dispensary discounts"],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DankPass',
  },
  openGraph: {
    title: "DankPass - Earn Free Weed | Upload Receipts & Burn Rewards",
    description: "Earn free weed with every receipt! Upload receipts from dispensaries and restaurants. Burn points for free weed, discounts, and exclusive perks. Earn & Burn rewards daily!",
    url: 'https://dankpass.vercel.app',
    siteName: 'DankPass',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'DankPass - Earn Free Weed & Burn Rewards',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DankPass - Earn Free Weed | Earn & Burn Rewards",
    description: "Earn free weed with every receipt! Upload receipts to earn points. Burn points for free weed, discounts, and exclusive perks. Join 10K+ users!",
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
      <body className={`${manrope.variable} ${outfit.variable} font-sans`}>
        <ErrorBoundary>
          <StackProvider app={stackServerApp}>
            <StackTheme>
              {children}
            </StackTheme>
          </StackProvider>
        </ErrorBoundary>
        {/* Cloudflare Web Analytics - Only in production */}
        {process.env.NODE_ENV === 'production' && (
          <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "82a08db3c9a241a782e7b8b75a9c58c4"}'></script>
        )}
      </body>
    </html>
  );
}
