import { NextApiRequest } from 'next'
import { NextRequest } from 'next/server'
import { createRequest, RequestMethod } from 'node-mocks-http'

type Query = { [key: string]: Query } | string[]

function urlToQuery(url: URL): Query {
  const segments = url.pathname.split('/').filter(Boolean)

  if (segments.length === 0) return {}
  if (segments.length === 1) return [segments[0]]

  let structure: { [key: string]: any } = {}
  let current = structure

  for (let i = 0; i < segments.length - 2; i++) {
    current[segments[i]] = {}
    current = current[segments[i]]
  }

  current[segments[segments.length - 2]] = [segments[segments.length - 1]]

  return {
    ...structure,
    ...Object.fromEntries(url.searchParams.entries()),
  }
}

export type RequestParams = {
  method: RequestMethod
  path: string
  body?: Record<string, unknown>
}

export function createNextApiRequest({ method, path, body }: RequestParams): NextApiRequest {
  return createRequest<NextApiRequest>({
    method,
    url: path,
    query: urlToQuery(new URL(path, 'http://localhost')),
    body,
  })
}

export function createNextRequestWithContext({
  method,
  path,
  body,
}: RequestParams): [NextRequest, { params: { [key: string]: string | string[] } }] {
  const url = new URL(`https://example.com/api${path}`)
  const request = new NextRequest(url, {
    method,
    body: JSON.stringify(body),
  })

  // simulate the Next.js context params, e.g. /api/makeswift/revalidate -> { params: { 'makeswift': ['revalidate'] } }
  const segments = url.pathname.split('/').slice(2)
  return [request, { params: { [segments[0]]: segments.slice(1) } }]
}
