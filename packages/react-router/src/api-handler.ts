import {
  type ApiHandlerUserConfig,
  createApiHandler as createMakeswiftApiHandler,
} from '@makeswift/runtime/framework-support'

import { Makeswift as MakeswiftClient } from './client'
import { siteVersionCookie } from './server/preview'

function validateApiRoute(params: Record<string, string>): string {
  const route = decodeURIComponent(params['*'] ?? '')
  if (route.includes('/api/') || route.includes('/makeswift/')) {
    throw new Error(
      `Unexpected API route '${route}'. Please make sure the Makeswift API handler is invoked from a nested catch-all route named 'api.makeswift.$.ts'`,
    )
  }

  return `/${route}`
}

async function revalidationHandler(path?: string): Promise<void> {
  if (path != null) {
    // revalidate a specific path
  } else {
    // revalidate the entire site
  }
}

export function createApiHandler(
  apiKey: string,
  { apiOrigin, runtime, ...userConfig }: ApiHandlerUserConfig,
) {
  const client = new MakeswiftClient(apiKey, { apiOrigin, runtime })

  return {
    async loader({ request, params }: { request: Request; params: Record<string, string> }) {
      const route = validateApiRoute(params)

      const apiHandler = createMakeswiftApiHandler(apiKey, {
        ...userConfig,
        runtime,
        client,
        revalidationHandler,
        previewCookieNames: [siteVersionCookie.name],
      })

      return await apiHandler(request, route)
    },
  }
}
