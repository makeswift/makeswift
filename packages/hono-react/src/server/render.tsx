import {
  renderToReadableStream,
  type ReactDOMServerReadableStream,
  type RenderToPipeableStreamOptions,
} from 'react-dom/server'

import { type ReactNode } from 'react'

import {
  createMakeswiftStylesRegistry,
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
): Promise<{ getStyles: () => string, html: ReactDOMServerReadableStream }> {
  const stylesRegistry = createMakeswiftStylesRegistry()

  const html = await renderToReadableStream(
    <RootStyleRegistry
      classNamePrefix={classNamePrefix}
      enableCssReset={enableCssReset}
      stylesRegistry={stylesRegistry}
      shouldRenderStyleElements={false}
    >
      {children}
    </RootStyleRegistry>,
    { ...renderOptions },
  )

  const getStyles = () => stylesRegistry.serializeToHtmlStyleTags()

  return { html, getStyles }
}
