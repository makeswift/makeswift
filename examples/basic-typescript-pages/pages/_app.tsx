import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

import '@/lib/makeswift/components'
import { MakeswiftProvider } from '@/lib/makeswift/provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps: { siteVersion, ...pageProps } }: AppProps) {
  return (
    <main className={inter.className}>
      <MakeswiftProvider siteVersion={siteVersion}>
        <Component {...pageProps} />
      </MakeswiftProvider>
    </main>
  )
}
