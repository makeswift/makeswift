import { Match, match as matchPattern } from 'path-to-regexp'

import { APIResource } from '../api'
import { ApiHandlerHeaders, deserializeSiteVersion } from '../api/site-version'

import { MakeswiftClient } from '../client'
import { ReactRuntime } from '../react'

import { redirectLiveHandler } from './handlers/redirect-live'
import { elementTreeHandler } from './handlers/element-tree'
import { fontsHandler, type Font, type GetFonts } from './handlers/fonts'
import { manifestHandler, type Manifest } from './handlers/manifest'
import { mergeTranslatedDataHandler } from './handlers/merge-translated-data'
import { revalidateHandler } from './handlers/revalidate'
import { translatableDataHandler } from './handlers/translatable-data'
import { webhookHandler } from './handlers/webhook'
import { type OnPublish } from './handlers/webhook/types'

import {
  type ApiRequest,
  type ErrorResponseBody,
  ApiResponse,
  searchParams,
} from './request-response'

import { applyCorsHeaders } from './cors'

export type { Manifest, Font }

type Events = { onPublish: OnPublish }

export type ApiHandlerUserConfig = {
  runtime: ReactRuntime
  appOrigin?: string
  apiOrigin?: string
  getFonts?: GetFonts
  events?: Events
}

// TODO type of revalidationHandler should always match what's in packages/runtime/src/next/api-handler/config revalidationHandler params, right?
export type ApiHandlerInternalConfig = {
  client: MakeswiftClient
  manifest?: Partial<Manifest>
  revalidationHandler: (path?: string, cacheTags?: string[]) => Promise<void>
  previewCookieNames: string[]
}

type ApiHandlerConfig = ApiHandlerUserConfig & ApiHandlerInternalConfig

type ResponseType =
  | Awaited<
      | ReturnType<typeof redirectLiveHandler>
      | ReturnType<typeof elementTreeHandler>
      | ReturnType<typeof fontsHandler>
      | ReturnType<typeof manifestHandler>
      | ReturnType<typeof mergeTranslatedDataHandler>
      | ReturnType<typeof revalidateHandler>
      | ReturnType<typeof translatableDataHandler>
      | ReturnType<typeof webhookHandler>
    >
  | ApiResponse<APIResource>
  | ApiResponse<ErrorResponseBody>
  | Response

type ApiHandler = (req: ApiRequest, route: string) => Promise<ResponseType>

export function createApiHandler(
  apiKey: string,
  {
    runtime,
    appOrigin = 'https://app.makeswift.com',
    getFonts,
    events,
    client,
    manifest,
    revalidationHandler,
    previewCookieNames,
  }: ApiHandlerConfig,
): ApiHandler {
  if (typeof apiKey !== 'string') {
    throw new Error(
      'The Makeswift API handler must be passed a valid Makeswift site API key. ' +
        `Received "${apiKey}" instead.`,
    )
  }

  return async function (req: ApiRequest, route: string): Promise<ResponseType> {
    const res =
      req.method.toUpperCase() !== 'OPTIONS'
        ? await apiRouteHandler(req, route)
        : new Response(null, { status: 204, headers: [['Content-Length', '0']] })

    applyCorsHeaders(res.headers, {
      origin: appOrigin,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })

    return res
  }

  async function apiRouteHandler(req: ApiRequest, route: string): Promise<ResponseType> {
    const versionHeader = req.headers.get(ApiHandlerHeaders.SiteVersion)

    const siteVersion = versionHeader != null ? deserializeSiteVersion(versionHeader) : null

    const matches = <T extends object>(pattern: string): Match<T> =>
      matchPattern<T>(pattern, { decode: decodeURIComponent })(route)

    if (matches('/redirect-live')) return redirectLiveHandler(req, { previewCookieNames })
    if (matches('/element-tree')) return elementTreeHandler(req, { runtime })
    if (matches('/fonts')) return fontsHandler(req, { getFonts })
    if (matches('/manifest')) return manifestHandler(req, { apiKey, manifest })
    if (matches('/merge-translated-data')) return mergeTranslatedDataHandler(req, { client })
    if (matches('/revalidate')) {
      return revalidateHandler(req, { apiKey, revalidatePath: revalidationHandler })
    }

    if (matches('/translatable-data')) return translatableDataHandler(req, { client })
    if (matches('/webhook')) {
      return webhookHandler(req, { apiKey, events, revalidate: revalidationHandler })
    }

    const handleResource = <T extends APIResource>(
      resource: T | null,
    ): ApiResponse<APIResource | ErrorResponseBody> => {
      return resource !== null
        ? ApiResponse.json(resource)
        : ApiResponse.json({ message: 'Not Found' }, { status: 404 })
    }

    let m

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
      const localeParam = searchParams(req).get('locale')
      const locale = typeof localeParam === 'string' ? localeParam : undefined

      return client.getPagePathnameSlice(m.params.id, siteVersion, { locale }).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/tables/:id'))) {
      return client.getTable(m.params.id).then(handleResource)
    }

    return ApiResponse.json({ message: 'Not Found' }, { status: 404 })
  }
}
