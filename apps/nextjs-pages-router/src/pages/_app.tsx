import { runtime } from '@/makeswift/runtime'
import { ReactRuntimeProvider } from '@makeswift/runtime/next'
import type { AppProps } from 'next/app'
import { Grenze_Gotisch, Grenze } from 'next/font/google'

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
  pageProps: { previewMode, locale, ...pageProps },
}: AppProps) {
  return (
    <main className={`${GrenzeGotischFont.variable} ${GrenzeFont.variable}`}>
      <ReactRuntimeProvider
        apiOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN}
        appOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_APP_ORIGIN}
        runtime={runtime}
        previewMode={previewMode}
        locale={locale}
      >
        <Component {...pageProps} />
      </ReactRuntimeProvider>
    </main>
  )
}
