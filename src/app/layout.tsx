import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { stackServerApp } from "@/stack";
import { ThemeProvider } from "@/contexts/ThemeContext";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dankpass.vercel.app'),
  title: "DankPass - Earn Free Weed | Upload Receipts & Burn Rewards | Refer Friends & Earn",
  description: "🔥 Earn free weed with every receipt! Upload receipts from dispensaries & restaurants to earn points. Burn points for free weed, discounts & exclusive perks. Refer friends and you both get 250 bonus points! Join 10K+ users earning & burning rewards daily!",
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const saved = localStorage.getItem('theme');
    const theme = saved === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch {}
})();`,
          }}
        />
        <ErrorBoundary>
          <StackProvider app={stackServerApp}>
            <StackTheme>
              <ThemeProvider>
                {children}
              </ThemeProvider>
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
