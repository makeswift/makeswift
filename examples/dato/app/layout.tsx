import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { draftMode } from 'next/headers'

import '@/lib/makeswift/components'
import { MakeswiftProvider } from '@/lib/makeswift/provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Makeswift + Dato',
  description: 'Dato handles the content. Makeswift makes it beautiful.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MakeswiftProvider previewMode={(await draftMode()).isEnabled}>
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}
