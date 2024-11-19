import { Head, Html, Main, NextScript } from 'next/document'

import { Document } from '@makeswift/runtime/next/document'
import { PreviewModeScript } from '@makeswift/runtime/next'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <PreviewModeScript
            appOrigin={process.env.MAKESWIFT_APP_ORIGIN}
            isPreview={this.props.__NEXT_DATA__.isPreview}
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
