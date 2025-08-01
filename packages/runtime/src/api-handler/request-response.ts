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
} as const

export type ErrorResponseBody = { message: string }
