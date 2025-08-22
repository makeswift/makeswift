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

import { StyleTagSSR } from '../runtimes/react/root-style-registry'

export class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await NextDocument.getInitialProps(ctx)

    const { extractCritical } = createEmotionServer(cache)
    const { ids, css } = extractCritical(initialProps.html)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <StyleTagSSR cacheKey={cache.key} classNames={ids} css={css} />
        </>
      ),
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
