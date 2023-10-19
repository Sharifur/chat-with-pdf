import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google';
import {ClerkProvider} from "@clerk/nextjs";
import { QueryProvider } from '@/provider/QueryProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatPDF',
  description: 'an app to chat with your with pdf content data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <QueryProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
      </QueryProvider>
  </ClerkProvider>
  )
}
