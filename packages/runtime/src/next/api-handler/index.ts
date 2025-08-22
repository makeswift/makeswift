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
): (...args: ApiHandlerArgs) => Promise<Response> | Promise<void> {
  const client = new MakeswiftClient(apiKey, { apiOrigin, runtime })

  async function handler(...args: ApiHandlerArgs): Promise<Response | void> {
    const { req, route, sendResponse, customRoutes, ...handlerConfig } = await match(args)
      .with(AppRouter.argsPattern, ([req, context]) => AppRouter.config({ req, context, client }))
      .with(PagesRouter.argsPattern, ([req, res]) => PagesRouter.config({ req, res, client }))
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

  // Next 15.5.0 performs type validations on the API handler. It expects a
  // return type of void | Promise<void> | Response | Promise<Response>, but
  // Typescript will not allow you to define an async function that returns a
  // union of two different Promises:

  // The return type of an async function or method must be the global
  // Promise<T> type. Did you mean to write 'Promise<void | Response>'?

  // This cast converts our handler's Promise<Response | void> return type to
  // Promise<Response> | Promise<void> to satisfy Next.js validations and bypass
  // the Typescript restriction. Ultimately, the value of the resolved type is
  // the same (Response | void).
  return handler as (...args: ApiHandlerArgs) => Promise<Response> | Promise<void>
}
