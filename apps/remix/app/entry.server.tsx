import { PassThrough, Transform } from 'node:stream'
import type { AppLoadContext, EntryContext } from 'react-router'
import { createReadableStreamFromReadable } from '@react-router/node'
import { ServerRouter } from 'react-router'
import { isbot } from 'isbot'
import type { RenderToPipeableStreamOptions } from 'react-dom/server'
import { renderToPipeableStream } from 'react-dom/server'
import {
  createRootStyleCache,
  RootStyleRegistry,
} from '@makeswift/runtime/next'

export const streamTimeout = 5_000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  return new Promise<Response>((resolve, reject) => {
    /* 1 ▸ Emotion cache ------------------------------------------------ */
    const { cache, flush } = createRootStyleCache({ key: 'mswft' })

    let shellRendered = false
    let didError = false

    const ua = request.headers.get('user-agent') ?? ''
    const readyEvt: keyof RenderToPipeableStreamOptions =
      isbot(ua) || routerContext.isSpaMode ? 'onAllReady' : 'onShellReady'

    /* ▲ hoist the transform so every callback can access it */
    let headInjector: Transform | null = null

    /* 2 ▸ React streaming --------------------------------------------- */
    const { pipe, abort } = renderToPipeableStream(
      <RootStyleRegistry cache={cache}>
        <ServerRouter context={routerContext} url={request.url} />
      </RootStyleRegistry>,
      {
        /* A. first paint (shell or all, depending on bot/SPA) */
        [readyEvt]() {
          shellRendered = true

          /* flush styles that already exist */
          const names = flush()
          let css = ''
          for (const n of names) css += cache.inserted[n]

          /* ▲ instantiate the transform *once* and keep the ref */
          headInjector = createHeadInjectionTransform(
            styleTag(cache.key, names, css),
          )

          const nodeStream = new PassThrough()
          const webStream = createReadableStreamFromReadable(
            nodeStream.pipe(headInjector),
          )

          responseHeaders.set('Content-Type', 'text/html')
          resolve(
            new Response(webStream, {
              status: responseStatusCode,
              headers: responseHeaders,
            }),
          )

          pipe(nodeStream)
        },

        /* B. all Suspense boundaries resolved */
        onAllReady() {
          /* flush late rules only if we already sent the shell */
          if (!headInjector) return
          const lateNames = flush()
          if (!lateNames.length) return

          let css = ''
          for (const n of lateNames) css += cache.inserted[n]

          /* ▲ write the second <style> through the transform */
          headInjector.write(styleTag(cache.key, lateNames, css))
        },

        onShellError: reject,
        onError(err) {
          didError = true
          if (shellRendered) console.error(err)
        },
      },
    )

    setTimeout(abort, streamTimeout + 1_000)
  })
}

/* helper to build a <style> tag */
function styleTag(key: string, names: string[], css: string) {
  return `<style data-emotion="${key} ${names.join(' ')}">${css}</style>`
}

/* transform that injects `snippet` right before the first </head> */
function createHeadInjectionTransform(snippet: string) {
  let injected = false
  return new Transform({
    transform(chunk, _enc, cb) {
      if (injected) return cb(null, chunk)

      const str = chunk.toString()
      const idx = str.indexOf('</head>')
      if (idx === -1) return cb(null, chunk) // not yet

      injected = true
      const out = str.slice(0, idx) + snippet + str.slice(idx)
      cb(null, out)
    },
  })
}
