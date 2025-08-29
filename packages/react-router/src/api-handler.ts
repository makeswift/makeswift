import {
  type ApiHandlerUserConfig,
  createApiHandler as createMakeswiftApiHandler,
} from '@makeswift/runtime/unstable-framework-support'

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

type UserConfig = ApiHandlerUserConfig & {
  revalidationHandler?: (path?: string) => Promise<void>
}

export function createApiHandler(
  apiKey: string,
  { apiOrigin, runtime, revalidationHandler, ...userConfig }: UserConfig,
) {
  const client = new MakeswiftClient(apiKey, { apiOrigin, runtime })

  return {
    async loader({ request, params }: { request: Request; params: Record<string, string> }) {
      const route = validateApiRoute(params)

      const apiHandler = createMakeswiftApiHandler(apiKey, {
        ...userConfig,
        runtime,
        client,
        revalidationHandler: revalidationHandler ?? (() => Promise.resolve()),
        previewCookieNames: [siteVersionCookie.name],
      })

      return await apiHandler(request, route)
    },
  }
}
