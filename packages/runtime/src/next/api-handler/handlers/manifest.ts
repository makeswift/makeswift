import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'

type Context = { params: { [key: string]: string | string[] } }

export type Manifest = {
  version: string
  previewMode: boolean
  interactionMode: boolean
  clientSideNavigation: boolean
  elementFromPoint: boolean
  customBreakpoints: boolean
  siteVersions: boolean
  unstable_siteVersions: boolean
  localizedPageSSR: boolean
  webhook: boolean
  localizedPagesOnlineByDefault: boolean
  previewToken: boolean
}

type ManifestError = { message: string }

export type ManifestResponse = Manifest | ManifestError

type ManifestHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<ManifestResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function handler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<ManifestResponse>>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ManifestResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function handler(
  ...args: ManifestHandlerArgs
): Promise<NextResponse<ManifestResponse> | void> {
  const [, , { apiKey }] = args

  const secret = match(args)
    .with(routeHandlerPattern, ([request]) => request.nextUrl.searchParams.get('secret'))
    .with(apiRoutePattern, ([req]) => req.query.secret)
    .exhaustive()

  if (secret !== apiKey) {
    const status = 401
    const body = { message: 'Unauthorized' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }

  const supportsWebhook = match(args)
    .with(routeHandlerPattern, () => true)
    .with(apiRoutePattern, () => false)
    .exhaustive()

  const body = {
    version: PACKAGE_VERSION,
    previewMode: false,
    draftMode: false,
    interactionMode: true,
    clientSideNavigation: false,
    elementFromPoint: false,
    customBreakpoints: true,
    siteVersions: true,
    unstable_siteVersions: true,
    localizedPageSSR: true,
    webhook: supportsWebhook,
    localizedPagesOnlineByDefault: true,
    previewToken: true,
  }

  return match(args)
    .with(routeHandlerPattern, () => NextResponse.json(body))
    .with(apiRoutePattern, ([, res]) => res.json(body))
    .exhaustive()
}
