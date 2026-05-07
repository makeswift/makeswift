// Captures server-side console output, raw stdout/stderr writes, uncaught
// errors, and structured per-request errors from Next.js's `onRequestError`
// instrumentation hook. Captured payloads are buffered in memory and fanned
// out to subscribers — the SSE handler at `/api/makeswift/logs` is the
// primary consumer, which the builder subscribes to directly via cross-origin
// EventSource.
//
// Wiring expectations:
// - The consumer's `instrumentation.ts` must call `setupServerLogCapture()`
//   in `register()` so capture is installed at server boot.
// - The consumer's `instrumentation.ts` should export `onRequestError`
//   delegating to `recordRequestError(...)` so request-scoped errors carry
//   structured route context.
// - State is backed by `globalThis` (keyed via `Symbol.for(...)`) because
//   Next.js bundles `instrumentation.ts` and route handlers into separate
//   module graphs in the same Node process. Without globalThis sharing, the
//   instrumentation's emit and the SSE handler's subscribe target different
//   in-memory singletons and never see each other's events.
//
// Caveats:
// - The buffer + subscriber set is process-local. In Node clusters or
//   per-invocation serverless deploys, an SSE subscriber may attach to a
//   worker that doesn't see logs from another worker. This is by design for
//   the dev/builder use case; do not treat this as observability for prod.

import { formatConsoleArgs, serializeArg, stripAnsi } from '../state/builder-api/serialize-log-arg'

export const SERVER_LOG_MESSAGE_TYPE = 'MAKESWIFT_SERVER_LOG' as const

export type ServerLogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

export type ServerLogSource =
  | 'console'
  | 'uncaught-exception'
  | 'unhandled-rejection'
  | 'request-error'

export type ServerLogPayload = {
  level: ServerLogLevel
  source: ServerLogSource
  args: unknown[]
  timestamp: number
  stack?: string
  route?: string
  routeType?: string
  // Present on `request-error` events: hardcoded to 500 since `onRequestError`
  // fires for unhandled errors that Next translates into 5xx responses.
  status?: number
}

export type ServerLogMessage = {
  type: typeof SERVER_LOG_MESSAGE_TYPE
  payload: ServerLogPayload
}

type Subscriber = (payload: ServerLogPayload) => void

const CONSOLE_METHODS: ServerLogLevel[] = ['log', 'info', 'warn', 'error', 'debug']
const BUFFER_CAP = 500

// Next.js bundles `instrumentation.ts` and the api-handler route into separate
// module graphs in the same Node process. Two graphs → two module instances →
// two distinct `subscribers` Sets and `buffer` arrays. The result is that
// `setupServerLogCapture()` (called from instrumentation) patches console in
// one instance, and `subscribeToServerLogs()` (called from the SSE handler in
// the route bundle) registers a subscriber in the other — so emits never reach
// the SSE stream.
//
// Backing the singleton state with `globalThis` makes both module instances
// share the same buffer / subscribers / patch flags, which is the standard
// fix for this duplication. Symbol.for() is used as the key so the state is
// addressable from any module instance without prior coordination.
type RelayState = {
  captured: boolean
  buffer: ServerLogPayload[]
  subscribers: Set<Subscriber>
  // Re-entrancy guard: if a subscriber's callback synchronously logs (or our
  // own emit path does), don't recursively capture.
  isRelaying: boolean
  // Set true while a `console.*` call is executing so the underlying
  // `process.{stdout,stderr}.write` patches don't double-emit. The console
  // wrapper logs the structured args; the stream patch only fires for raw
  // writes that bypass console (e.g. Next.js writing pretty error frames
  // directly to stderr).
  isInsideConsoleCall: boolean
}

const STATE_KEY = Symbol.for('@makeswift/runtime:server-log-relay-state')

function getState(): RelayState {
  const g = globalThis as { [k: symbol]: unknown }
  let state = g[STATE_KEY] as RelayState | undefined
  if (state == null) {
    state = {
      captured: false,
      buffer: [],
      subscribers: new Set(),
      isRelaying: false,
      isInsideConsoleCall: false,
    }
    g[STATE_KEY] = state
  }
  return state
}

function emit(payload: ServerLogPayload): void {
  const state = getState()
  if (state.isRelaying) return
  state.isRelaying = true
  try {
    if (state.buffer.length >= BUFFER_CAP) state.buffer.shift()
    state.buffer.push(payload)
    for (const cb of state.subscribers) {
      try {
        cb(payload)
      } catch {
        // Swallow — a broken subscriber shouldn't block the rest.
      }
    }
  } finally {
    state.isRelaying = false
  }
}

/**
 * Install global capture for `console.*`, raw `process.{stdout,stderr}.write`
 * output, uncaught exceptions, and unhandled rejections. Idempotent — calling
 * more than once is safe and a no-op after the first successful call.
 *
 * Intended to be invoked from the consumer's `instrumentation.ts` `register()`
 * function so capture is in place before any user code runs.
 */
export function setupServerLogCapture(): void {
  const state = getState()
  if (state.captured) return
  state.captured = true

  for (const level of CONSOLE_METHODS) {
    const original = console[level].bind(console)
    console[level] = (...args: unknown[]) => {
      state.isInsideConsoleCall = true
      try {
        original(...args)
      } finally {
        state.isInsideConsoleCall = false
      }
      emit({
        level,
        source: 'console',
        args: formatConsoleArgs(args).map(serializeArg),
        timestamp: Date.now(),
      })
    }
  }

  // Edge runtime exposes a stub `process` without `on`. Skip listener
  // installation there; console patching above still works.
  if (typeof process !== 'undefined' && typeof process.on === 'function') {
    process.on('uncaughtException', (err: unknown) => {
      emit({
        level: 'error',
        source: 'uncaught-exception',
        args: [serializeArg(err)],
        timestamp: Date.now(),
        stack: err instanceof Error ? err.stack : undefined,
      })
    })

    process.on('unhandledRejection', (reason: unknown) => {
      emit({
        level: 'error',
        source: 'unhandled-rejection',
        args: [serializeArg(reason)],
        timestamp: Date.now(),
        stack: reason instanceof Error ? reason.stack : undefined,
      })
    })
  }

  // Patch raw stream writes to catch output that bypasses `console.*` —
  // notably, Next.js dev's pretty error frames and some structured log lines
  // that go straight to `process.stderr.write(...)`. Without this, server
  // component throws can render in the iframe overlay without ever surfacing
  // in the relay because Next never routed the trace through the console.
  patchStreamWrite('stdout', 'log')
  patchStreamWrite('stderr', 'error')
}

function patchStreamWrite(name: 'stdout' | 'stderr', level: ServerLogLevel): void {
  if (typeof process === 'undefined') return
  const stream = process[name]
  if (stream == null || typeof stream.write !== 'function') return

  const state = getState()
  const original = stream.write.bind(stream)
  // The `write` method has multiple overloads; cast through `unknown` so we
  // don't have to enumerate them here.
  stream.write = ((chunk: unknown, ...rest: unknown[]) => {
    if (!state.isInsideConsoleCall) {
      const text = chunkToString(chunk)
      if (text != null && text.trim().length > 0) {
        emit({
          level,
          source: 'console',
          args: [stripAnsi(text).replace(/\n+$/, '')],
          timestamp: Date.now(),
        })
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (original as any)(chunk, ...rest)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
}

function chunkToString(chunk: unknown): string | null {
  if (typeof chunk === 'string') return chunk
  if (chunk instanceof Uint8Array) {
    try {
      return new TextDecoder().decode(chunk)
    } catch {
      return null
    }
  }
  return null
}

/**
 * Adapt Next.js's `onRequestError(err, request, context)` signature into a
 * structured `request-error` payload with route context. Wire this from
 * `instrumentation.ts`:
 *
 *   export const onRequestError: typeof import('next').onRequestError =
 *     (err, request, context) => recordRequestError(err, request, context)
 */
export function recordRequestError(
  err: unknown,
  request: {
    path?: string
    method?: string
    headers?: Record<string, string | string[] | undefined>
  },
  context: {
    routePath?: string
    routeType?: string
    revalidateReason?: string
  },
): void {
  emit({
    level: 'error',
    source: 'request-error',
    args: [serializeArg(err)],
    timestamp: Date.now(),
    stack: err instanceof Error ? err.stack : undefined,
    route: context.routePath ?? request.path,
    routeType: context.routeType,
    // `onRequestError` fires for unhandled errors during request processing,
    // which Next translates into a 5xx response. Tagging the event so the
    // builder UI can show the status alongside other access logs.
    status: 500,
  })
}

/**
 * Subscribe to the relay. Replays the buffered backlog synchronously so a
 * fresh subscriber gets recent context. Returns an unsubscribe function.
 */
export function subscribeToServerLogs(cb: Subscriber): () => void {
  const state = getState()
  for (const payload of state.buffer) {
    try {
      cb(payload)
    } catch {
      // ignore — broken subscriber shouldn't break replay for others
    }
  }
  state.subscribers.add(cb)
  return () => {
    state.subscribers.delete(cb)
  }
}
