import { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

import clsx from 'clsx'

import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={clsx(inter.variable, 'font-sans')}>
      <Component {...pageProps} />
    </main>
  )
}

export default MyApp
