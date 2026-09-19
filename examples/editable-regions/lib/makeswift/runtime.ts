import { ReactRuntime } from '@makeswift/runtime/next'

export const runtime = new ReactRuntime({
  apiOrigin: process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN,
})
