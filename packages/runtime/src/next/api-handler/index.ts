import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { Match, match as matchPattern } from 'path-to-regexp'
import { APIResource } from '../../api'
import { Makeswift } from '../client'

import elementTree, { ElementTreeResponse } from './handlers/element-tree'
import fonts, { Font, FontsResponse, GetFonts } from './handlers/fonts'
import manifest, { Manifest, ManifestResponse } from './handlers/manifest'
import redirectPreview, { type RedirectPreviewResponse } from './handlers/redirect-preview'
import clearDraft, { type ClearDraftResponse } from './handlers/clear-draft'
import { revalidate, RevalidationResponse } from './handlers/revalidate'
import translatableData, { TranslatableDataResponse } from './handlers/translatable-data'
import mergeTranslatedData, { TranslatedDataResponse } from './handlers/merge-translated-data'
import webhook from './handlers/webhook'
import { OnPublish, WebhookResponseBody } from './handlers/webhook/types'
import { ReactRuntime } from '../../react'
import { P, match } from 'ts-pattern'
import { ApiHandlerHeaders, MakeswiftVersionData } from '../../api/site-version'

export type { Manifest, Font }

type Context = { params: { [key: string]: string | string[] } }

type Events = { onPublish: OnPublish }

type MakeswiftApiHandlerConfig = {
  appOrigin?: string
  apiOrigin?: string
  getFonts?: GetFonts
  events?: Events
  runtime: ReactRuntime
}

type NotFoundError = { message: string }

export type MakeswiftApiHandlerResponse =
  | ManifestResponse
  | RevalidationResponse
  | RedirectPreviewResponse
  | ClearDraftResponse
  | FontsResponse
  | ElementTreeResponse
  | TranslatableDataResponse
  | TranslatedDataResponse
  | APIResource
  | NotFoundError
  | WebhookResponseBody

type MakeswiftApiHandlerArgs =
  | [NextRequest, Context]
  | [NextApiRequest, NextApiResponse<MakeswiftApiHandlerResponse>]

function apiRequestParams(request: NextApiRequest): Promise<NextApiRequest['query']> {
  // `NextApiRequest.query` prop became async in Next.js 15, but it's not reflected in the type definition;
  // force-casting it to a `Promise` manually
  return Promise.resolve(request.query)
}

export function MakeswiftApiHandler(
  apiKey: string,
  {
    appOrigin = 'https://app.makeswift.com',
    apiOrigin = 'https://api.makeswift.com',
    getFonts,
    events,
    runtime,
  }: MakeswiftApiHandlerConfig,
): (...args: MakeswiftApiHandlerArgs) => Promise<NextResponse<MakeswiftApiHandlerResponse> | void> {
  const cors = Cors({ origin: appOrigin })

  if (typeof apiKey !== 'string') {
    throw new Error(
      'The Makeswift Next.js API handler must be passed a valid Makeswift site API key: ' +
        "`MakeswiftApiHandler('<makeswift_site_api_key>')`\n" +
        `Received "${apiKey}" instead.`,
    )
  }

  const routeHandlerPattern = [P.instanceOf(Request), P.any] as const
  const apiRoutePattern = [P.any, P.any] as const

  return function handler(
    ...args: MakeswiftApiHandlerArgs
  ): Promise<NextResponse<MakeswiftApiHandlerResponse> | void> {
    return match(args)
      .with(routeHandlerPattern, async args => {
        const response = await makeswiftApiHandler(...args)

        response.headers.append('Access-Control-Allow-Origin', appOrigin)
        response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        return response
      })
      .with(apiRoutePattern, async args => {
        const [req, res] = args

        await new Promise<void>((resolve, reject) => {
          cors(req, res, err => {
            if (err instanceof Error) reject(err)
            else resolve()
          })
        })

        return await makeswiftApiHandler(...args)
      })
      .exhaustive()
  }

  function getSiteVersionFromRequest(args: MakeswiftApiHandlerArgs): MakeswiftVersionData | null {
    const { version, token } = match(args)
      .with(routeHandlerPattern, ([request]) => ({
        version: request.headers.get(ApiHandlerHeaders.SiteVersion),
        token: request.headers.get(ApiHandlerHeaders.PreviewToken),
      }))
      .with(apiRoutePattern, ([req]) => ({
        version: req.headers[ApiHandlerHeaders.SiteVersion.toLowerCase()] ?? null,
        token: req.headers[ApiHandlerHeaders.PreviewToken.toLowerCase()] ?? null,
      }))
      .exhaustive()

    if (typeof version !== 'string') {
      console.error(`Received an invalid Makeswift site version header: "${version}"`)
      return null
    }

    if (typeof token !== 'string') {
      console.error(`Received an invalid Makeswift preview token header: "${token}"`)
      return null
    }

    return { makeswift: true, version, token }
  }

  async function makeswiftApiHandler(
    request: NextRequest,
    context: Context,
  ): Promise<NextResponse<MakeswiftApiHandlerResponse>>
  async function makeswiftApiHandler(
    req: NextApiRequest,
    res: NextApiResponse<MakeswiftApiHandlerResponse>,
  ): Promise<void>
  async function makeswiftApiHandler(
    ...args: MakeswiftApiHandlerArgs
  ): Promise<NextResponse<MakeswiftApiHandlerResponse> | void> {
    const params = match(args)
      .with(routeHandlerPattern, ([, context]) => context.params)
      .with(apiRoutePattern, ([req]) => apiRequestParams(req))
      .exhaustive()

    const { makeswift } = await params

    if (!Array.isArray(makeswift)) {
      throw new Error(
        'The Makeswift Next.js API handler must be used in a dynamic catch-all route named `[...makeswift]`.\n' +
          `Received "${makeswift}" for the \`makeswift\` param instead.\n` +
          'Read more about dynamic catch-all routes here: https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes',
      )
    }

    const client = new Makeswift(apiKey, { apiOrigin, runtime })
    const siteVersion = getSiteVersionFromRequest(args)
    const action = '/' + makeswift.join('/')
    const matches = <T extends object>(pattern: string): Match<T> =>
      matchPattern<T>(pattern, { decode: decodeURIComponent })(action)

    let m

    if (matches('/manifest')) {
      return match(args)
        .with(routeHandlerPattern, args => manifest(...args, { apiKey }))
        .with(apiRoutePattern, args => manifest(...args, { apiKey }))
        .exhaustive()
    }

    if (matches('/revalidate')) {
      return match(args)
        .with(routeHandlerPattern, args => revalidate(...args, { apiKey }))
        .with(apiRoutePattern, args => revalidate(...args, { apiKey }))
        .exhaustive()
    }

    if (matches('/redirect-preview')) {
      return match(args)
        .with(routeHandlerPattern, args => redirectPreview(...args, client))
        .with(apiRoutePattern, args => redirectPreview(...args, client))
        .exhaustive()
    }

    if (matches('/clear-draft')) {
      return match(args)
        .with(routeHandlerPattern, args => clearDraft(...args, { apiKey }))
        .with(apiRoutePattern, args => clearDraft(...args, { apiKey }))
        .exhaustive()
    }

    if (matches('/fonts')) {
      return match(args)
        .with(routeHandlerPattern, args => fonts(...args, { getFonts }))
        .with(apiRoutePattern, args => fonts(...args, { getFonts }))
        .exhaustive()
    }

    if (matches('/element-tree')) {
      return match(args)
        .with(routeHandlerPattern, args => elementTree(...args, runtime))
        .with(apiRoutePattern, args => elementTree(...args, runtime))
        .exhaustive()
    }

    if (matches('/translatable-data')) {
      return match(args)
        .with(routeHandlerPattern, args => translatableData(...args, client))
        .with(apiRoutePattern, args => translatableData(...args, client))
        .exhaustive()
    }

    if (matches('/merge-translated-data')) {
      return match(args)
        .with(routeHandlerPattern, args => mergeTranslatedData(...args, client))
        .with(apiRoutePattern, args => mergeTranslatedData(...args, client))
        .exhaustive()
    }

    if (matches('/webhook')) {
      return match(args)
        .with(routeHandlerPattern, args => webhook(...args, { apiKey, events }))
        .with(apiRoutePattern, args => webhook(...args, { apiKey, events }))
        .exhaustive()
    }

    const handleResource = <T extends APIResource>(
      resource: T | null,
    ): NextResponse<MakeswiftApiHandlerResponse> | void => {
      const status = resource === null ? 404 : 200
      const body = resource === null ? { message: 'Not Found' } : resource

      return match(args)
        .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
        .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
        .exhaustive()
    }

    if ((m = matches<{ id: string }>('/swatches/:id'))) {
      return client.getSwatch(m.params.id, siteVersion).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/files/:id'))) {
      return client.getFile(m.params.id).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/typographies/:id'))) {
      return client.getTypography(m.params.id, siteVersion).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/global-elements/:id'))) {
      return client.getGlobalElement(m.params.id, siteVersion).then(handleResource)
    }

    if (
      (m = matches<{ globalElementId: string; locale: string }>(
        '/localized-global-elements/:globalElementId/:locale',
      ))
    ) {
      return client
        .getLocalizedGlobalElement(m.params.globalElementId, m.params.locale, siteVersion)
        .then(handleResource)
    }

    if ((m = matches<{ id: string }>('/page-pathname-slices/:id'))) {
      const localeParam = match(args)
        .with(routeHandlerPattern, ([request]) => request.nextUrl.searchParams.get('locale'))
        .with(apiRoutePattern, ([req]) => req.query.locale)
        .exhaustive()
      const locale = typeof localeParam === 'string' ? localeParam : undefined

      return client.getPagePathnameSlice(m.params.id, siteVersion, { locale }).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/tables/:id'))) {
      return client.getTable(m.params.id).then(handleResource)
    }

    const status = 404
    const body = { message: 'Not Found' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }
}
