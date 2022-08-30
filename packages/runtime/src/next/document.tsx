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
import { KeyUtils } from 'slate'
import { ServerStyleSheet } from 'styled-components'
import { PreviewModeScript } from './preview-mode'

export class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await NextDocument.getInitialProps(ctx)

      KeyUtils.resetGenerator()

      const { extractCritical } = createEmotionServer(cache)
      const { ids, css } = extractCritical(initialProps.html)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            <style
              data-emotion={`css ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    const { isPreview } = this.props.__NEXT_DATA__

    return (
      <Html>
        <Head>
          <PreviewModeScript isPreview={isPreview} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
