// Standalone server function calls are treated as pure queries by default
// and do not trigger a page re-render; wrap a function with `mutation`
// when it changes renderable state.
export function mutation<F extends (...args: any[]) => any>(fn: F): F {
  ;(fn as any).__isMutation = true
  return fn
}

export function isMutationAction(fn: Function): boolean {
  return (fn as any).__isMutation === true
}
