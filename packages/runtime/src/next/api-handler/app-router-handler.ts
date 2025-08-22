type Params = { [key: string]: string | string[] }

export type Context = { params: Promise<Params> }

// export type NextAppRouterRequest = NextRequest | Request

// export function normalizeRequest(req: NextAppRouterRequest): NextRequest {
//   return req instanceof NextRequest ? req : new NextRequest(req, req)
// }
