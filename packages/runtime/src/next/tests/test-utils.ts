import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server'
import {
  createRequest,
  createResponse,
  type RequestMethod,
  type MockResponse,
} from 'node-mocks-http'

import { MakeswiftApiHandler } from '../api-handler'
import { ReactRuntime } from '../../react'

export type MakeswiftApiHandlerArgs = Partial<Parameters<typeof MakeswiftApiHandler>[1]>

export const TestOrigins = {
  apiOrigin: 'https://api.fakeswift.com',
  appOrigin: 'https://app.fakeswift.com',
} as const

function createHandler(apiKey: string, args: Partial<MakeswiftApiHandlerArgs> = {}) {
  const runtime = new ReactRuntime()
  return MakeswiftApiHandler(apiKey, {
    ...args,
    runtime,
    apiOrigin: TestOrigins.apiOrigin,
    appOrigin: TestOrigins.appOrigin,
  })
}

export const hostUrl = (path: string) => new URL(path, 'https://example.com')

function routeParams(url: URL) {
  // simulate Next.js API route's context params, e.g. /api/makeswift/revalidate -> { 'makeswift': ['revalidate'] }
  const segments = url.pathname.split('/').filter(Boolean).slice(1)
  return { [segments[0]]: segments.slice(1) }
}

export type RequestParams = {
  method: RequestMethod
  path: string
  originalPath?: string
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

function createNextApiRequest({
  method,
  path,
  originalPath,
  body,
  headers,
}: RequestParams): NextApiRequest {
  const url = hostUrl(originalPath ?? path)
  return createRequest<NextApiRequest>({
    method,
    url: url.toString(),
    query: {
      ...routeParams(hostUrl(path)),
      ...Object.fromEntries(url.searchParams.entries()),
      ...(originalPath ? { path: originalPath } : {}),
    },
    body,
    headers,
  })
}

function createNextRequestWithContext({
  method,
  path,
  originalPath,
  body,
  headers,
}: RequestParams): [NextRequest, { params: { [key: string]: string | string[] } }] {
  const request = new NextRequest(hostUrl(originalPath ?? path), {
    method,
    body: JSON.stringify(body),
    headers,
  })

  return [request, { params: routeParams(hostUrl(path)) }]
}

export function pagesRouterApiRequestFixture(
  args: MakeswiftApiHandlerArgs = {},
  responseMock?: MockResponse<NextApiResponse>,
) {
  const apiKey = 'pages-router-api-key'
  const handler = createHandler(apiKey, args)

  const response = responseMock ?? createResponse<NextApiResponse>()
  const testApiRequest = async (reqParams: RequestParams) => {
    await handler(createNextApiRequest(reqParams), response)
    return {
      statusCode: response.statusCode,
      get jsonBody() {
        return response._getJSONData()
      },
      get textBody() {
        return response._getData()
      },
      headers: {
        getSetCookie() {
          return response._getHeaders()['set-cookie']
        },
        get(key: string) {
          return key.toLowerCase() === 'location'
            ? response._getRedirectUrl()
            : response._getHeaders()[key]
        },
      },
    }
  }

  return { testApiRequest, apiKey }
}

export function appRouterApiRequestFixture(args: MakeswiftApiHandlerArgs = {}) {
  const apiKey = 'app-router-api-key'
  const handler = createHandler(apiKey, args)
  const testApiRequest = async (reqParams: RequestParams) => {
    const response = await handler(...createNextRequestWithContext(reqParams))
    return {
      statusCode: response?.status,
      get jsonBody() {
        return response?.json()
      },
      get textBody() {
        return response?.text()
      },
      headers: response?.headers ?? new Headers(),
    }
  }

  return { testApiRequest, apiKey }
}

export const apiRequestFixtures = [
  { fixture: pagesRouterApiRequestFixture, router: 'pages' },
  { fixture: appRouterApiRequestFixture, router: 'app' },
]
