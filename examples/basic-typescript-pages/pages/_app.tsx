import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

import { MakeswiftProvider } from '@/lib/makeswift/provider'

import './globals.css'
import '@/lib/makeswift/components'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps: { previewMode, ...pageProps } }: AppProps) {
  return (
    <main className={inter.className}>
      <MakeswiftProvider previewMode={previewMode}>
        <Component {...pageProps} />
      </MakeswiftProvider>
    </main>
  )
}
