import { createFromReadableStream } from '@vitejs/plugin-rsc/ssr'

import {
  createMakeswiftStylesRegistry,
  RootStyleRegistry,
} from '@makeswift/runtime/unstable-framework-support'

import React from 'react'
import type { ReactFormState } from 'react-dom/client'
import { renderToReadableStream } from 'react-dom/server.edge'
import { injectRSCPayload } from 'rsc-html-stream/server'

import type { RscPayload } from './rsc'
import { rootStyleProps } from '../lib/makeswift/styles'

export type RenderHTML = typeof renderHTML

export async function renderHTML(
  rscStream: ReadableStream<Uint8Array>,
  options?: {
    request: Request
    formState?: ReactFormState
    nonce?: string
    debugNojs?: boolean
  },
): Promise<Response> {
  // duplicate one RSC stream into two.
  // - one for SSR (ReactClient.createFromReadableStream below)
  // - another for browser hydration payload by injecting <script>...FLIGHT_DATA...</script>.
  const [rscStream1, rscStream2] = rscStream.tee()

  // deserialize RSC stream back to React VDOM
  let payload: Promise<RscPayload>
  function SsrRoot() {
    // deserialization needs to be kicked off inside ReactDOMServer context
    // for ReactDomServer preinit/preloading to work
    payload ??= createFromReadableStream<RscPayload>(rscStream1)
    return React.use(payload).root
  }

  // render html (traditional SSR)
  const stylesRegistry = createMakeswiftStylesRegistry()
  const bootstrapScriptContent =
    await import.meta.viteRsc.loadBootstrapScriptContent('index')

  let htmlStream: ReadableStream<Uint8Array>
  let status: number | undefined
  try {
    htmlStream = await renderToReadableStream(
      <RootStyleRegistry
        {...rootStyleProps}
        stylesRegistry={stylesRegistry}
        shouldRenderStyleElements={false}
      >
        <SsrRoot />
      </RootStyleRegistry>,
      {
        bootstrapScriptContent: options?.debugNojs
          ? undefined
          : bootstrapScriptContent,
        nonce: options?.nonce,
        formState: options?.formState,
      },
    )
  } catch (e) {
    // fallback to render an empty shell and run pure CSR on browser,
    // which can replay server component error and trigger error boundary.
    status = 500
    htmlStream = await renderToReadableStream(
      <html>
        <body>
          <noscript>Internal Server Error: SSR failed</noscript>
        </body>
      </html>,
      {
        bootstrapScriptContent:
          `self.__NO_HYDRATE=1;` +
          (options?.debugNojs ? '' : bootstrapScriptContent),
        nonce: options?.nonce,
      },
    )
  }

  let responseStream: ReadableStream<Uint8Array> = htmlStream
  if (!options?.debugNojs) {
    // initial RSC stream is injected in HTML stream as <script>...FLIGHT_DATA...</script>
    responseStream = responseStream.pipeThrough(
      injectRSCPayload(rscStream2, {
        nonce: options?.nonce,
      }),
    )
  }

  // consume the stream to ensure that all components have rendered and populated
  // the styles registry before flushing;
  const html = await new Response(responseStream).text()
  const styles = stylesRegistry.serializeToHtmlStyleTags()

  // inject Makeswift client component styles right before head's close tag
  return new Response(html.replace('</head>', `${styles}</head>`), {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  })
}
