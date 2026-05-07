// SSE endpoint the builder subscribes to (cross-origin, directly from
// `appOrigin`) to receive server-side log events streamed from the host.

import { SERVER_LOG_MESSAGE_TYPE, subscribeToServerLogs } from '../server-log-relay'

import { type ApiRequest } from '../request-response'

const SSE_KEEPALIVE_MS = 25_000

/**
 * SSE handler. Streams `{ type, payload }` envelopes — one per server log
 * event — to the builder, which opens the EventSource cross-origin from
 * `appOrigin`.
 *
 * Auth model: accept the request if its `Origin` header matches `appOrigin`
 * (the standard builder subscription) OR if it's same-origin to the host
 * (kept for local debugging from a tab on the host's own origin). Browsers
 * omit the Origin header on same-origin GETs, so a null origin is treated
 * as same-origin.
 */
export function logsStreamHandler(req: ApiRequest, appOrigin: string): Response {
  // Preflight for cross-origin EventSource isn't strictly required (GET with
  // no custom headers is "simple"), but handle it cleanly if it arrives.
  if (req.method.toUpperCase() === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(appOrigin, 'GET, OPTIONS'),
    })
  }

  if (req.method.toUpperCase() !== 'GET') {
    return new Response(null, { status: 405, headers: { Allow: 'GET' } })
  }

  if (!isAllowedOrigin(req, appOrigin)) {
    return new Response(null, { status: 403 })
  }

  const encoder = new TextEncoder()

  let unsubscribe: (() => void) | null = null
  let keepalive: ReturnType<typeof setInterval> | null = null

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk))
        } catch {
          // Controller closed mid-write (client disconnected). The `cancel`
          // path will clean up; nothing else to do here.
        }
      }

      unsubscribe = subscribeToServerLogs(payload => {
        send(`data: ${JSON.stringify({ type: SERVER_LOG_MESSAGE_TYPE, payload })}\n\n`)
      })

      // Periodic keepalive to defeat proxy idle timeouts and dev-server
      // half-closed connections.
      keepalive = setInterval(() => send(`: ping\n\n`), SSE_KEEPALIVE_MS)
    },
    cancel() {
      if (unsubscribe) unsubscribe()
      unsubscribe = null
      if (keepalive) clearInterval(keepalive)
      keepalive = null
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      ...corsHeaders(appOrigin, 'GET'),
    },
  })
}

function corsHeaders(appOrigin: string, allowMethods: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': appOrigin,
    'Access-Control-Allow-Methods': allowMethods,
    Vary: 'Origin',
  }
}

function isAllowedOrigin(req: ApiRequest, appOrigin: string): boolean {
  const origin = req.headers.get('origin')
  if (origin === appOrigin) return true
  return isSameOrigin(req)
}

function isSameOrigin(req: ApiRequest): boolean {
  const origin = req.headers.get('origin')
  // Browsers omit Origin on same-origin GETs; treat absence as same-origin
  // since cross-origin browser requests always include it.
  if (origin == null) return true

  let requestHost: string | null = null
  try {
    requestHost = new URL(req.url, 'http://localhost').host
  } catch {}

  let originHost: string | null = null
  try {
    originHost = new URL(origin).host
  } catch {}

  // If we can't determine either host, fail open — the URL parser failed on
  // values it could never have, not on legitimate input.
  if (requestHost == null || originHost == null) return true

  return requestHost === originHost
}
