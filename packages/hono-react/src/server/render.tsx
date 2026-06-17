import {
  renderToReadableStream,
  type ReactDOMServerReadableStream,
  type RenderToPipeableStreamOptions,
} from 'react-dom/server'

import { type ReactNode } from 'react'

import {
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
    | 'onError'
  >

export async function renderHtml(
  children: ReactNode,
  { classNamePrefix, enableCssReset, ...renderOptions }: RenderOptions = {},
): Promise<{ html: ReactDOMServerReadableStream }> {
  const html = await renderToReadableStream(
    <RootStyleRegistry classNamePrefix={classNamePrefix} enableCssReset={enableCssReset}>
      {children}
    </RootStyleRegistry>,
    { ...renderOptions },
  )

  return { html }
}
