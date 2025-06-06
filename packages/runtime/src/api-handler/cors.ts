// loosely based on https://github.com/tinyhttp/cors

import { type ApiResponse } from './request-response'

export type CorsOptions = {
  origin?: string
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

export function applyCorsHeaders(res: ApiResponse, options: CorsOptions) {
  const {
    origin = '*',
    methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders = ['content-type'],
    exposedHeaders,
    credentials,
    maxAge,
  } = options

  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', methods.join(', ').toUpperCase())

  if (allowedHeaders) res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '))
  if (exposedHeaders) res.setHeader('Access-Control-Expose-Headers', exposedHeaders.join(', '))
  if (credentials)    res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (maxAge != null) res.setHeader('Access-Control-Max-Age', `${maxAge}`)
}
