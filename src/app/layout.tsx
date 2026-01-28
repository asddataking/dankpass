import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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
  metadataBase: new URL('https://dankpass.com'),
  title: "DankPass — Loyalty-as-a-Service for Dispensaries | Earn & Burn",
  description: "Modern loyalty for dispensaries. White-labeled rewards powered by SMS, email, and real customer data. Use DankPass as your dispensary loyalty program, and optionally pair it with deal discovery through Daily Dispo Deals. Starts at $299/month.",
  keywords: ["dispensary loyalty", "cannabis loyalty program", "earn and burn", "loyalty as a service", "dispensary rewards", "customer retention", "SMS rewards", "white label loyalty"],
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
    title: "DankPass — Loyalty-as-a-Service for Dispensaries | Earn & Burn",
    description: "Modern loyalty for dispensaries. White-labeled rewards, SMS & email, QR signup. Own your customer list. Starts at $299/month.",
    url: 'https://dankpass.com',
    siteName: 'DankPass',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'DankPass - Loyalty-as-a-Service for Dispensaries',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DankPass — Loyalty-as-a-Service for Dispensaries",
    description: "Modern loyalty for dispensaries. Earn & Burn rewards, SMS & email, own your customer data. Starts at $299/month.",
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
          <ThemeProvider>
            <SiteHeader />
            <main className="min-h-screen">
              {children}
            </main>
            <SiteFooter />
          </ThemeProvider>
        </ErrorBoundary>
        {/* Cloudflare Web Analytics - Only in production */}
        {process.env.NODE_ENV === 'production' && (
          <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "82a08db3c9a241a782e7b8b75a9c58c4"}'></script>
        )}
      </body>
    </html>
  );
}
