import '../styles/globals.css'

import { AppProps } from 'next/app'

import { CartProvider } from 'lib/cart-context'
import { ProductsContext } from 'lib/products-context'
import { ProductContext } from 'lib/product-context'

export default function App({ Component, pageProps }: any) {
  return (
    <CartProvider>
      <ProductsContext.Provider value={pageProps.products}>
        <ProductContext.Provider value={pageProps.product}>
          <Component {...pageProps} />
        </ProductContext.Provider>
      </ProductsContext.Provider>
    </CartProvider>
  )
}
