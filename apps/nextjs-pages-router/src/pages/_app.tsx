import { runtime } from '@/makeswift/runtime'
import { ReactRuntimeProvider } from '@makeswift/runtime/next'
import type { AppProps } from 'next/app'
import { Grenze_Gotisch, Grenze } from 'next/font/google'
import { type PageProps } from './[[...path]]'

import '@/makeswift/components'
import '@/pages/global.css'

const GrenzeGotischFont = Grenze_Gotisch({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-grenze-gotisch',
})

const GrenzeFont = Grenze({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-grenze',
})

export default function App({
  Component,
  pageProps: { locale, siteVersion, ...pageProps },
}: AppProps<Partial<PageProps>>) {
  return (
    <main className={`${GrenzeGotischFont.variable} ${GrenzeFont.variable}`}>
      <ReactRuntimeProvider
        runtime={runtime}
        siteVersion={siteVersion}
        locale={locale}
      >
        <Component {...pageProps} />
      </ReactRuntimeProvider>
    </main>
  )
}
