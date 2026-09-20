import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { getSiteVersion } from '@makeswift/runtime/next/server'

import '@/lib/makeswift/components'
import { MakeswiftProvider } from '@/lib/makeswift/provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Makeswift + Contentful',
  description: 'Contentful handles the content. Makeswift makes it beautiful.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MakeswiftProvider siteVersion={await getSiteVersion()}>
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}
