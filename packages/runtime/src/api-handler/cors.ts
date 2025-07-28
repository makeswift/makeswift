// loosely based on https://github.com/tinyhttp/cors

export type CorsOptions = {
  origin?: string
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

export function applyCorsHeaders(headers: Headers, options: CorsOptions) {
  const {
    origin = '*',
    methods = ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders = ['Content-Type'],
    exposedHeaders,
    credentials,
    maxAge,
  } = options

  headers.append('Access-Control-Allow-Origin', origin)
  headers.append('Access-Control-Allow-Methods', methods.join(', ').toUpperCase())

  if (allowedHeaders) headers.append('Access-Control-Allow-Headers', allowedHeaders.join(', '))
  if (exposedHeaders) headers.append('Access-Control-Expose-Headers', exposedHeaders.join(', '))
  if (credentials) headers.append('Access-Control-Allow-Credentials', 'true')
  if (maxAge != null) headers.append('Access-Control-Max-Age', `${maxAge}`)
}
