import { Html, Head, Main, NextScript } from 'next/document'
import { Document, PreviewModeScript } from '@makeswift/runtime/next'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <PreviewModeScript isPreview={this.props.__NEXT_DATA__.isPreview} />
          <meta name="application-name" content="BigCommerce Example Store" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="BigCommerce Example Store" />
          <meta
            name="description"
            content="A visually editable, custom storefront with a layout created in Makeswift and products hosted in BigCommerce"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/icons/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          <link rel="apple-touch-icon" href="/icons/icon-96x96.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />

          <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://makeswift-examples-bigcommerce.vercel.app/" />
          <meta name="twitter:title" content="BigCommerce Example Store" />
          <meta
            name="twitter:description"
            content="A visually editable, custom storefront with a layout created in Makeswift and products hosted in BigCommerce"
          />
          <meta
            name="twitter:image"
            content="https://yourdomain.com/icons/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@makeswifthq" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="BigCommerce Example Store" />
          <meta
            property="og:description"
            content="A visually editable, custom storefront with a layout created in Makeswift and products hosted in BigCommerce"
          />
          <meta property="og:site_name" content="BigCommerce Example Store" />
          <meta property="og:url" content="https://makeswift-examples-bigcommerce.vercel.app/" />
          <meta
            property="og:image"
            content="https://makeswift-examples-bigcommerce.vercel.app/icons/icon-96x96.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
