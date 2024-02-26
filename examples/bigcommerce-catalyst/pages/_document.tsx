/* eslint-disable check-file/filename-naming-convention */
/* eslint-disable no-underscore-dangle */
import { Document, PreviewModeScript } from '@makeswift/runtime/next';
import { Head, Html, Main, NextScript } from 'next/document';

export default class BcDocument extends Document {
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
    );
  }
}
