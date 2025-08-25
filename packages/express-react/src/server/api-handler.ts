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
} from '@makeswift/runtime/framework-support'

import { Makeswift as MakeswiftClient } from '../client'

const API_PATH_PREFIX = '/api/makeswift/'

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
): RequestHandler {
  const client = new MakeswiftClient(apiKey, { apiOrigin, runtime })

  return async function apiHandler(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    if (!req.path.startsWith(API_PATH_PREFIX)) {
      return next()
    }

    const route = `/${req.path.replace(API_PATH_PREFIX, '')}`

    const apiHandler = createMakeswiftApiHandler(apiKey, {
      ...userConfig,
      previewCookieNames: [MAKESWIFT_SITE_VERSION_COOKIE],
      revalidationHandler,
      runtime,
      client,
    })

    return pipeResponseTo(await apiHandler(toApiRequest(req), route), res)
  }
}
