import { runtime } from '@/makeswift/runtime'
import { ReactRuntimeProvider } from '@makeswift/runtime/next'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactRuntimeProvider runtime={runtime}>
      <Component {...pageProps} />
    </ReactRuntimeProvider>
  )
}
