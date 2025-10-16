import {
  createApiHandler,
  MAKESWIFT_SITE_VERSION_COOKIE,
} from '@makeswift/runtime/unstable-framework-support'
import { client } from './client'
import { runtime } from './runtime'
import { MAKESWIFT_SITE_API_KEY } from './env'

export const API_PATH_PREFIX = '/api/makeswift/'

export async function MakeswiftApiHandler(request: Request): Promise<Response> {
  // Create the Makeswift API handler
  const apiHandler = createApiHandler(MAKESWIFT_SITE_API_KEY, {
    runtime,
    client,
    previewCookieNames: [MAKESWIFT_SITE_VERSION_COOKIE],
    revalidationHandler: () => Promise.resolve(),
  })

  // Extract the route path after the API prefix
  const url = new URL(request.url)
  const route = `/${url.pathname.replace(API_PATH_PREFIX, '')}`

  // Call the handler and return the response
  return apiHandler(request, route)
}
