import { runtime } from '@/makeswift/runtime'
import { ReactRuntimeProvider } from '@makeswift/runtime/next'
import type { AppProps } from 'next/app'

import '@/pages/global.css'

export default function App({
  Component,
  pageProps: { previewMode, locale, ...pageProps },
}: AppProps) {
  return (
    <ReactRuntimeProvider
      apiOrigin={process.env.MAKESWIFT_API_ORIGIN}
      runtime={runtime}
      previewMode={previewMode}
      locale={locale}
    >
      <Component {...pageProps} />
    </ReactRuntimeProvider>
  )
}
