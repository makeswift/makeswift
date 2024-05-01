import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

import { MakeswiftProvider } from '@/lib/makeswift/provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <MakeswiftProvider>
        <Component {...pageProps} />
      </MakeswiftProvider>
    </main>
  )
}
