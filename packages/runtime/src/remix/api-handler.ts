import {
  type ApiHandlerUserConfig,
  createApiHandler as createMakeswiftApiHandler,
} from '../api-handler'

import { MakeswiftClient } from '../client'

import { previewModeCookie } from './preview-mode'

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
    // revalidatePath(path)
  } else {
    // revalidateTag(MAKESWIFT_CACHE_TAG)
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
        manifest: {
          previewMode: true,
        },
        draftCookieNames: [previewModeCookie.name],
        revalidationHandler,
        runtime,
        client,
      })

      return await apiHandler(request, route)
    },
  }
}
