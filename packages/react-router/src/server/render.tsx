import { type ReactNode } from 'react'

import { createReadableStreamFromReadable } from '@react-router/node'
import { renderToPipeableStream } from 'react-dom/server'
import { PassThrough, Transform } from 'node:stream'

import {
  createRootStyleCache,
  RootStyleRegistry,
  styleTagHtml,
  type RootStyleProps,
} from '@makeswift/runtime/framework-support'

const DEFAULT_TIMEOUT = 10000

export function renderHtml(
  children: ReactNode,
  {
    timeout,
    cacheKey,
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
  const cache = createRootStyleCache({ key: cacheKey })

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <RootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
        {children}
      </RootStyleRegistry>,
      {
        // wait for all Suspense boundaries before streaming for consistent Emotion CSS
        onAllReady() {
          // create a head injection transform with server-side styles
          const { classNames, css } = cache.flush()
          const headInjector = createHeadInjectionTransform(
            styleTagHtml({ cacheKey: cache.key, classNames, css }),
          )

          // prepare a pipeable response stream with the head transform
          const body = new PassThrough()
          const responseStream = createReadableStreamFromReadable(
            classNames.length > 0 ? body.pipe(headInjector) : body,
          )

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
