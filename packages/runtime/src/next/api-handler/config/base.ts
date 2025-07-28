import { type ApiHandlerInternalConfig } from '../../../api-handler'
import { type ApiRequest, type ApiResponse } from '../../../api-handler/request-response'

export type ApiHandlerConfig = Omit<ApiHandlerInternalConfig, 'client' | 'revalidationHandler'> & {
  req: ApiRequest
  route: string
  sendResponse: (res: ApiResponse) => Promise<Response | void>
  revalidationHandler: (path?: string) => Promise<void>
  customRoutes: (route: string) => Promise<{ res: Response | void } | null>
}

export function validateApiRoute(params: Partial<{ [key: string]: string | string[] }>): string {
  const { makeswift } = params

  if (!Array.isArray(makeswift)) {
    throw new Error(
      'The Makeswift Next.js API handler must be used in a dynamic catch-all route named `[...makeswift]`.\n' +
        `Received "${makeswift}" for the \`makeswift\` param instead.\n` +
        'Read more about dynamic catch-all routes here: https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes',
    )
  }

  return '/' + makeswift.join('/')
}
