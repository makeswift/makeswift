import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { getSiteVersion } from '@makeswift/runtime/next/server'

import { NAVIGATION_COMPONENT_TYPE } from '@/components/Navigation/register'
import { Component } from '@/lib/makeswift/component'
import '@/lib/makeswift/components'
import { MakeswiftProvider } from '@/lib/makeswift/provider'

import { env } from '../env'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  other: {
    'algolia-site-verification': env.ALGOLIA_SITE_VERIFICATION ?? '',
  },
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
          <Component type={NAVIGATION_COMPONENT_TYPE} label="Navigation" snapshotId="navigation" />
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}
