import { RSCRuntime } from '@makeswift/runtime/rsc'

export const runtime = new RSCRuntime({
  appOrigin: import.meta.env.VITE_MAKESWIFT_APP_ORIGIN,
  apiOrigin: import.meta.env.VITE_MAKESWIFT_API_ORIGIN,
  fetch: fetch,
})
