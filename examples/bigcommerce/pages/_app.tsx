import '../styles/globals.css'

import { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'

import { CartProvider } from 'lib/cart-context'
import { PreviewableLocaleProvider } from 'components/locale/locale-context'

function App({ Component, pageProps }: AppProps) {
  return (
    <PreviewableLocaleProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </PreviewableLocaleProvider>
  )
}

export default appWithTranslation(App)
