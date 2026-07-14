export type ControlContext = Record<string, unknown>

// --- Incoming (ambient) slot -------------------------------------------------
// Set by the bridge's receiving side around the real function; read
// synchronously by `unstable_getControlContext()` at the top of `getOptions`.
let ambientContext: ControlContext | undefined = undefined

/**
 * Read the element's other control values inside a control's `getOptions`.
 * Returns `{}` when no context was supplied (published runtime, or a builder
 * that hasn't sent context yet). Weakly typed for the spike — callers cast.
 *
 * Spike limitation: read this synchronously, before the first `await`.
 */
export function unstable_getControlContext(): ControlContext {
  return ambientContext ?? {}
}

/** Internal: run `fn` with `context` installed as the ambient value. */
export function withAmbientControlContext<T>(
  context: ControlContext | undefined,
  fn: () => T,
): T {
  const previous = ambientContext
  ambientContext = context
  try {
    return fn()
  } finally {
    ambientContext = previous
  }
}

// --- Outgoing slot -----------------------------------------------------------
// Set by the caller (builder / demo stub / test) around a bridged call; read
// at `postMessage` time so it rides along as the call's context payload.
let outgoingContext: ControlContext | undefined = undefined

/** Internal: read the context to attach to the next bridged call, if any. */
export function getOutgoingControlContext(): ControlContext | undefined {
  return outgoingContext
}

/**
 * Run `fn` (which invokes one or more bridged `getOptions` proxies) with
 * `context` attached to those calls' payloads. In a real builder cosmos calls
 * this before invoking a control's `getOptions`; the spike uses it in tests
 * and the demo stub.
 *
 * Spike limitation: the bridged proxy call must be initiated synchronously
 * inside `fn`, before any `await` — an `await` first would restore the
 * outgoing slot and drop the context.
 */
export function unstable_runWithControlContext<T>(
  context: ControlContext,
  fn: () => T,
): T {
  const previous = outgoingContext
  outgoingContext = context
  try {
    return fn()
  } finally {
    outgoingContext = previous
  }
}
