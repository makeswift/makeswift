import {
  type Request as ExpressRequest,
  type Response as ExpressResponse,
  type RequestHandler,
  type NextFunction,
} from 'express'

import {
  type ApiHandlerUserConfig,
  MAKESWIFT_SITE_VERSION_COOKIE,
  createApiHandler as createMakeswiftApiHandler,
  toApiRequest,
  pipeResponseTo,
} from '@makeswift/runtime/unstable-framework-support'

import { Makeswift as MakeswiftClient } from '../client'

const API_PATH_PREFIX = '/api/makeswift/'

type UserConfig = ApiHandlerUserConfig & {
  revalidationHandler?: (path?: string) => Promise<void>
}

export function createApiHandler(
  apiKey: string,
  { runtime, revalidationHandler, ...userConfig }: UserConfig,
): RequestHandler {
  const client = new MakeswiftClient(apiKey, { runtime })

  return async function apiHandler(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    if (!req.path.startsWith(API_PATH_PREFIX)) {
      return next()
    }

    const route = `/${req.path.replace(API_PATH_PREFIX, '')}`

    const apiHandler = createMakeswiftApiHandler(apiKey, {
      ...userConfig,
      previewCookieNames: [MAKESWIFT_SITE_VERSION_COOKIE],
      revalidationHandler: revalidationHandler ?? (() => Promise.resolve()),
      runtime,
      client,
    })

    return pipeResponseTo(await apiHandler(toApiRequest(req), route), res)
  }
}
