import { P } from 'ts-pattern'
import { NextApiRequest, NextApiResponse } from 'next'

import { type ApiResponse } from '../../../api-handler/request-response'

import { pagesRouterRedirectPreviewHandler } from '../handlers/pages-router-redirect-preview'
import { PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE } from '../preview'

import { validateApiRoute, type ApiHandlerConfig } from './base'
import { MakeswiftClient } from '../../../client'

export type ApiHandlerArgs = [NextApiRequest, NextApiResponse]
export const argsPattern = [P.any, P.any] as const

export async function config({
  req,
  res,
  client,
}: {
  req: NextApiRequest
  res: NextApiResponse
  client: MakeswiftClient
}): Promise<ApiHandlerConfig> {
  return {
    req: {
      headers: requestHeaders(req.headers),
      method: req.method ?? 'GET',
      url: req.url ?? '',
      json() {
        return req.body
      },
    },
    route: validateApiRoute(await apiRequestParams(req)),
    manifest: {},
    previewCookieNames: [PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE],
    sendResponse: async (apiResponse: ApiResponse): Promise<Response | void> => {
      const headers = responseHeaders(apiResponse.headers)
      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value)
      })

      res.status(apiResponse.status)

      if (apiResponse.body) {
        await pipeTo(apiResponse.body, res)
      }

      res.end()
    },
    revalidationHandler: async (path?: string): Promise<void> => {
      if (path != null) {
        res.revalidate(path)
      } else {
        // No-op, Pages Router does not support tag-based revalidation
      }
    },
    customRoutes: async (route: string) => {
      if (route === '/redirect-preview') {
        return { res: await pagesRouterRedirectPreviewHandler(req, res, client) }
      }

      return null
    },
  }
}

function apiRequestParams(request: NextApiRequest): Promise<NextApiRequest['query']> {
  // `NextApiRequest.query` prop became async in Next.js 15, but it's not reflected in the type definition;
  // force-casting it to a `Promise` manually
  return Promise.resolve(request.query)
}

function requestHeaders(headers: NextApiRequest['headers']): Headers {
  const result = new Headers()
  for (const [key, value] of Object.entries(headers)) {
    if (value != null) {
      if (Array.isArray(value)) {
        value.forEach(v => result.append(key, v))
      } else {
        result.append(key, value)
      }
    }
  }

  return result
}

function responseHeaders(headers: Headers): Record<string, string | string[]> {
  return [...headers.entries()].reduce<Record<string, string | string[]>>((acc, [key, value]) => {
    if (key in acc) {
      const existingValue = acc[key]
      if (Array.isArray(existingValue)) {
        existingValue.push(value)
      } else {
        acc[key] = [existingValue, value]
      }
    } else {
      acc[key] = value
    }
    return acc
  }, {})
}

async function pipeTo(stream: ReadableStream<Uint8Array>, res: NextApiResponse): Promise<void> {
  try {
    const reader = stream.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(value)
    }
  } catch (error) {
    res.destroy(error instanceof Error ? error : new Error(`${error}`))
  }
}
