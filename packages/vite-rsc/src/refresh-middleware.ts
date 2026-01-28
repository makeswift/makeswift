import { type Middleware } from '@reduxjs/toolkit'
import { createRSCRefreshMiddleware as createBaseRSCRefreshMiddleware } from '@makeswift/runtime/unstable-framework-support'

const RSC_REFRESH_EVENT = 'makeswift:rsc-refresh'

/**
 * Triggers an RSC refresh by dispatching a custom event.
 * This will cause the browser entry to refetch the RSC payload from the server.
 */
export function refreshRSC(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(RSC_REFRESH_EVENT))
  }
}

/**
 * Creates a Redux middleware that triggers an RSC refresh when server components are added.
 * Uses a custom event that the Vite RSC browser entry listens for.
 */
export function createViteRSCRefreshMiddleware(): Middleware {
  return createBaseRSCRefreshMiddleware(refreshRSC)
}
