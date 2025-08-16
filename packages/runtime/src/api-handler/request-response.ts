export type ApiRequest = Pick<Request, 'method' | 'json' | 'headers' | 'url'>

export function searchParams(req: ApiRequest): URLSearchParams {
  // provide a placeholder domain to enable parsing of relative URLs
  return new URL(req.url, 'http://localhost').searchParams
}

export interface ApiResponse<R extends unknown = unknown> extends Response {
  readonly __responseType?: R // prevent unsafe assignment between instances with incompatible `R`
}

export const ApiResponse = {
  json<T>(body: T, init?: ResponseInit): ApiResponse<T> {
    const headers = new Headers(init?.headers)
    headers.set('Content-Type', 'application/json')

    return new Response(JSON.stringify(body), {
      ...init,
      headers,
    }) as ApiResponse<T>
  },

  redirect(location: string | URL, init?: ResponseInit): ApiResponse<null> {
    const headers = new Headers(init?.headers)
    headers.set('Location', location.toString())

    // Manually constructing a redirect response. We can’t use the
    // `Response.redirect` shorthand here, since it doesn’t allow passing custom
    // headers; see
    // https://community.cloudflare.com/t/make-redirect-with-additional-headers/249365
    return new Response(null, {
      status: 307,
      ...init,
      headers,
    }) as ApiResponse<null>
  },
} as const

export type ErrorResponseBody = { message: string }
