import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - DankPass',
  description: 'Sign in to your DankPass account',
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
