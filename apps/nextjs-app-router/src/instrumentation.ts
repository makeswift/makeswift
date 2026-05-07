import {
  recordRequestError,
  setupServerLogCapture,
} from '@makeswift/runtime/next'

export function register() {
  setupServerLogCapture()
}

export function onRequestError(
  err: unknown,
  request: {
    path: string
    method: string
    headers: Record<string, string | string[] | undefined>
  },
  context: {
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
    revalidateReason?: 'on-demand' | 'stale'
  },
): void {
  recordRequestError(err, request, context)
}
