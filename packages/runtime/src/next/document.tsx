'use client'

import { cache } from '@emotion/css'
import createEmotionServer from '@emotion/server/create-instance'
import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import { PreviewModeScript } from './preview-mode'

type DocumentProps = { appOrigin?: string }

export class Document extends NextDocument<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await NextDocument.getInitialProps(ctx)

    const { extractCritical } = createEmotionServer(cache)
    const { ids, css } = extractCritical(initialProps.html)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style data-emotion={`css ${ids.join(' ')}`} dangerouslySetInnerHTML={{ __html: css }} />
        </>
      ),
    }
  }

  render() {
    const { isPreview } = this.props.__NEXT_DATA__

    return (
      <Html>
        <Head>
          <PreviewModeScript isPreview={isPreview} appOrigin={this.props.appOrigin} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
