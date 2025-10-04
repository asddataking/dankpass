import { Inter } from 'next/font/google'
import { StackProvider } from '@stackframe/stack'
import { stackServerApp } from '@/lib/stack'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DankPass - Weed + Food Loyalty',
  description: 'Upload receipts from dispensaries and restaurants to earn Dank Points and redeem rewards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StackProvider app={stackServerApp}>
          {children}
        </StackProvider>
      </body>
    </html>
  )
}