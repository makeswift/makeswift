import { NextApiRequest } from 'next'
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

export function createNextApiRequest({
  method,
  path,
  body,
}: {
  method: RequestMethod
  path: string
  body?: Record<string, unknown>
}): NextApiRequest {
  return createRequest<NextApiRequest>({
    method,
    url: path,
    query: urlToQuery(new URL(path, 'http://localhost')),
    body,
  })
}
