import { match } from 'ts-pattern'

import { Makeswift as MakeswiftClient } from '../client'

import { type ApiHandlerUserConfig, createApiHandler } from '../../api-handler'

import * as AppRouter from './config/app-router'
import * as PagesRouter from './config/pages-router'

/**
 * @deprecated This type is deprecated and will be removed in a future release.
 */
export type MakeswiftApiHandlerResponse = any

type ApiHandlerArgs = AppRouter.ApiHandlerArgs | PagesRouter.ApiHandlerArgs

export function MakeswiftApiHandler(
  apiKey: string,
  { apiOrigin, runtime, ...userConfig }: ApiHandlerUserConfig,
): (...args: ApiHandlerArgs) => Promise<Response | void> {
  const client = new MakeswiftClient(apiKey, { apiOrigin, runtime })

  return async function handler(...args: ApiHandlerArgs): Promise<Response | void> {
    const { req, route, sendResponse, customRoutes, ...handlerConfig } = await match(args)
      .with(AppRouter.argsPattern, ([req, context]) => AppRouter.config({ req, context, apiKey }))
      .with(PagesRouter.argsPattern, ([req, res]) => PagesRouter.config({ req, res, apiKey }))
      .exhaustive()

    const apiHandler = createApiHandler(apiKey, {
      ...userConfig,
      ...handlerConfig,
      runtime,
      client,
    })

    const customRouteResponse = await customRoutes(route)
    if (customRouteResponse) {
      return customRouteResponse.res
    }

    return sendResponse(await apiHandler(req, route))
  }
}
