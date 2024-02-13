import type { NextRequest } from 'next/server'
import { withMakeswiftMiddleware } from '@makeswift/runtime/next'

export async function middleware(request: NextRequest) {
  // TODO: Currently, there's a TS error with the function call below if the
  // there's a nextjs version mismatch between the host app and the runtime.

  // @ts-expect-error
  return await withMakeswiftMiddleware(request)
}
