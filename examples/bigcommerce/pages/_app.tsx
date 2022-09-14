import '../styles/globals.css'

import { AppProps } from 'next/app'

import { CartProvider } from 'lib/cart-context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  )
}
