import { type ReactNode } from 'react'

import { createReadableStreamFromReadable } from '@react-router/node'
import { renderToPipeableStream } from 'react-dom/server'
import { PassThrough } from 'node:stream'

import {
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
  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <RootStyleRegistry classNamePrefix={classNamePrefix} enableCssReset={enableCssReset}>
        {children}
      </RootStyleRegistry>,
      {
        /*
          TODO: consider switching to `onShellReady` now that we are no longer
          relying on a manual mechanism to insert `<style>`s into the `<head>`?
        */
        onAllReady() {
          // prepare a pipeable response stream
          const body = new PassThrough()
          const responseStream = createReadableStreamFromReadable(body)

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
