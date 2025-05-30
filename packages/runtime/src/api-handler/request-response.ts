export type ApiRequest = {
  readonly method: string

  getSearchParam(name: string): string | string[] | null
  getHeader(name: string): string | string[] | null
  json(): Promise<any>
}

export type ApiResponse<R extends unknown = unknown> = {
  readonly __responseType?: R // prevent unsafe assignment between instances with incompatible `R`

  status(status: number): ApiResponse<R>
  json<Body extends R>(body: Body): ApiResponse<Body>
  setHeader(name: string, value: string): ApiResponse<R>
  finalize(): Response | void
}

export function finalize(response: ApiResponse | Response | void): Response | void {
  if (response instanceof Response) {
    return response
  }

  if (response != null) return response.finalize()
}

export type ErrorResponseBody = { message: string }
