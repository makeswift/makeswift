import {
  renderToReadableStream,
  type ReactDOMServerReadableStream,
  type RenderToPipeableStreamOptions,
} from 'react-dom/server'

import { type ReactNode } from 'react'

import {
  createStreamingStyleCache,
  RootStyleRegistry,
  type RootStyleProps,
} from '@makeswift/runtime/unstable-framework-support'

type RenderOptions = RootStyleProps &
  Pick<
    RenderToPipeableStreamOptions,
    | 'identifierPrefix'
    | 'namespaceURI'
    | 'nonce'
    | 'bootstrapScriptContent'
    | 'bootstrapScripts'
    | 'bootstrapModules'
    | 'progressiveChunkSize'
  >

export async function renderHtml(
  children: ReactNode,
  { cacheKey, enableCssReset, ...renderOptions }: RenderOptions = {},
): Promise<{ html: ReactDOMServerReadableStream; styles: ReadableStream<Uint8Array> }> {
  const cache = createStreamingStyleCache({ key: cacheKey })
  const html = await renderToReadableStream(
    <RootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
      {children}
    </RootStyleRegistry>,
    {
      ...renderOptions,
      onError(error: unknown) {
        throw Error(`Server-side rendering error: ${error}`)
      },
    },
  )

  html.allReady.then(() => {
    cache.closeStream()
  })

  return { html, styles: cache.stylesStream }
}
