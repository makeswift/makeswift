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
import { PreviewModeScript } from './preview-mode'

export class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await NextDocument.getInitialProps(ctx)

    KeyUtils.resetGenerator()

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
