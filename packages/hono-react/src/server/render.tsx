import {
  renderToReadableStream,
  type ReactDOMServerReadableStream,
  type RenderToPipeableStreamOptions,
} from 'react-dom/server'

import { type ReactNode } from 'react'

import {
  createFlushableStyleCache,
  RootStyleRegistry,
  styleTagHtml,
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
): Promise<{ html: ReactDOMServerReadableStream; getStyles: () => string }> {
  const cache = createFlushableStyleCache({ key: cacheKey })
  const getStyles = () => styleTagHtml({ cacheKey: cache.key, ...cache.flush() })

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

  return { html, getStyles }
}
