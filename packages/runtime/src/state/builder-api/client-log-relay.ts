// Captures clientside console output and uncaught errors from the host runtime
// and forwards them to the builder via `window.parent.postMessage` so the
// builder can surface them to the user. This is intentionally independent of
// the MessageChannel-based builder API: it has no dependency on the channel
// being established, and uses a distinct message `type` so the builder can
// route it without interfering with the existing port-based traffic.
//
// Capture installs eagerly at module-load time so that early-render logs
// (RSC console replay, hydration warnings, errors thrown before the runtime
// finishes booting) are not missed. Until `setupClientLogCapture` is called
// to supply an `appOrigin`, captured entries sit in a bounded buffer and are
// flushed once the destination is known.

import { formatConsoleArgs, serializeArg } from './serialize-log-arg'

export const CLIENT_LOG_MESSAGE_TYPE = 'MAKESWIFT_CLIENT_LOG' as const

export type ClientLogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

export type ClientLogSource = 'console' | 'window-error' | 'unhandled-rejection'

export type ClientLogMessage = {
  type: typeof CLIENT_LOG_MESSAGE_TYPE
  payload: {
    level: ClientLogLevel
    source: ClientLogSource
    args: unknown[]
    timestamp: number
    stack?: string
  }
}

const CONSOLE_METHODS: ClientLogLevel[] = ['log', 'info', 'warn', 'error', 'debug']
const BUFFER_CAP = 500

let appOrigin: string | null = null
const buffer: ClientLogMessage[] = []

// Re-entrancy guard: if any code on the postMessage path itself logs (browser
// warnings, our own catch blocks, etc.), don't recursively capture.
let isRelaying = false

function deliver(message: ClientLogMessage): void {
  if (isRelaying) return
  if (appOrigin == null) {
    if (buffer.length >= BUFFER_CAP) buffer.shift()
    buffer.push(message)
    return
  }
  isRelaying = true
  try {
    window.parent.postMessage(message, appOrigin)
  } catch {
    // postMessage can throw if the payload isn't structured-cloneable.
    // Swallow — we already pre-serialize, but defend against edge cases.
  } finally {
    isRelaying = false
  }
}

let captureInstalled = false

function installCapture(): void {
  if (captureInstalled) return
  if (typeof window === 'undefined') return
  // No parent to relay to — the host is loaded standalone (e.g. production
  // visit, not inside the builder iframe). Skip entirely so we don't wrap
  // console for non-builder contexts.
  if (window.parent === window) return
  captureInstalled = true

  for (const level of CONSOLE_METHODS) {
    const original = console[level].bind(console)
    console[level] = (...args: unknown[]) => {
      original(...args)
      deliver({
        type: CLIENT_LOG_MESSAGE_TYPE,
        payload: {
          level,
          source: 'console',
          args: formatConsoleArgs(args).map(serializeArg),
          timestamp: Date.now(),
        },
      })
    }
  }

  window.addEventListener('error', (event: ErrorEvent) => {
    deliver({
      type: CLIENT_LOG_MESSAGE_TYPE,
      payload: {
        level: 'error',
        source: 'window-error',
        args: [serializeArg(event.error ?? event.message)],
        timestamp: Date.now(),
        stack: event.error instanceof Error ? event.error.stack : undefined,
      },
    })
  })

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const reason = event.reason
    deliver({
      type: CLIENT_LOG_MESSAGE_TYPE,
      payload: {
        level: 'error',
        source: 'unhandled-rejection',
        args: [serializeArg(reason)],
        timestamp: Date.now(),
        stack: reason instanceof Error ? reason.stack : undefined,
      },
    })
  })
}

// Eager install at module-load time. Buffered until `setupClientLogCapture`
// supplies the destination origin.
installCapture()

export function setupClientLogCapture({ appOrigin: origin }: { appOrigin: string }): VoidFunction {
  // Defensive — also covers the case where this module is imported before
  // `window` exists and the eager call no-op'd.
  installCapture()

  appOrigin = origin

  // Flush anything captured before we knew where to send it.
  while (buffer.length > 0) {
    const next = buffer.shift()
    if (next != null) deliver(next)
  }

  return () => {
    // Don't unwrap console — keep capturing into the buffer so a subsequent
    // `setupClientLogCapture` call (e.g. after a StrictMode remount) can flush
    // anything logged in the gap.
    appOrigin = null
  }
}
