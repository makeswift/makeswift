import { type ReactNode } from 'react'

import { createReadableStreamFromReadable } from '@react-router/node'
import { renderToPipeableStream } from 'react-dom/server'
import { PassThrough, Transform } from 'node:stream'

import {
  createMakeswiftStylesRegistry,
  RootStyleRegistry,
  type RootStyleProps,
} from '@makeswift/runtime/unstable-framework-support'

const DEFAULT_TIMEOUT = 10000

export function renderHtml(
  children: ReactNode,
  {
    timeout,
    classNamePrefix,
    enableCssReset,
    responseStatusCode,
    responseHeaders,
  }: RootStyleProps & {
    request: Request
    timeout?: number
    responseStatusCode: number
    responseHeaders: Headers
  },
): Promise<Response> {
  const stylesRegistry = createMakeswiftStylesRegistry()

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <RootStyleRegistry
        stylesRegistry={stylesRegistry}
        classNamePrefix={classNamePrefix}
        enableCssReset={enableCssReset}
        shouldRenderStyleElements={false}
      >
        {children}
      </RootStyleRegistry>,
      {
        // wait for all Suspense boundaries before streaming to ensure all Makeswift styles have been generated & stored in the registry
        onAllReady() {
          // create a head injection transform with server-side styles
          const headInjector = createHeadInjectionTransform(
            stylesRegistry.serializeToHtmlStyleTags()
          )

          // prepare a pipeable response stream with the head transform
          const body = new PassThrough()
          const responseStream = createReadableStreamFromReadable(body.pipe(headInjector))

          // amend response headers with content type
          responseHeaders.set('Content-Type', 'text/html; charset=utf-8')

          // return the stream response
          resolve(
            new Response(responseStream, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          )

          // write the initial HTML doctype and start piping the stream
          body.write('<!DOCTYPE html>')
          pipe(body)
        },
        onShellError(err) {
          reject(err)
        },
        onError(err) {
          didError = true
          console.error(err)
        },
      },
    )

    setTimeout(abort, timeout ?? DEFAULT_TIMEOUT)
  })
}

function createHeadInjectionTransform(snippet: string) {
  let injected = false
  return new Transform({
    transform(chunk, _enc, cb) {
      if (injected) return cb(null, chunk)

      // inject `snippet` right before the first </head> tag
      const str = chunk.toString()
      const idx = str.indexOf('</head>')
      if (idx === -1) return cb(null, chunk)

      injected = true
      const out = str.slice(0, idx) + snippet + str.slice(idx)
      cb(null, out)
    },
  })
}
