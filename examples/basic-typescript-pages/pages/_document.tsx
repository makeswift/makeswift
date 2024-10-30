import { Head, Html, Main, NextScript } from 'next/document'

import { PreviewModeScript } from '@makeswift/runtime/next'
import { Document } from '@makeswift/runtime/next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <PreviewModeScript isPreview={this.props.__NEXT_DATA__.isPreview} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
