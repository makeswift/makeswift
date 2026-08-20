import ky, { HTTPError, isHTTPError, type KyInstance } from './ky'

import {
  type File,
  type GlobalElement,
  type LocalizedGlobalElement,
  type PagePathnameSlice,
  type Swatch,
  type Typography,
  type HttpFetch,
} from './types'

import { type SiteVersion } from './site-version'
import * as Schema from './schema'

const RetryBackoffConfig = {
  MaxAttempts: 3,
  MaxDelayMs: 5_000,
}

export class MakeswiftRestAPIClient {
  private _fetch: KyInstance

  readonly apiKey: string
  readonly apiOrigin: string

  constructor({
    fetch,
    apiKey,
    apiOrigin,
  }: {
    fetch: HttpFetch
    apiKey: string
    apiOrigin: string
  }) {
    this._fetch = ky.create({
      fetch,
      timeout: false,
      retry: {
        statusCodes: [429],
        limit: RetryBackoffConfig.MaxAttempts,
        backoffLimit: RetryBackoffConfig.MaxDelayMs,
        delay: attemptCount => 2 ** (attemptCount - 1) * 1000,
        jitter: true,
      },
      hooks: {
        beforeRetry: [
          async ({ request, error, retryCount }) => {
            console.warn(
              `Request to ${request.url} failed with ${error}. Retrying (${retryCount}/${RetryBackoffConfig.MaxAttempts})`,
            )
            // Drain the response body before retrying so we don't leak unconsumed
            // response bodies (see the comment on `failedResponseBody` below).
            if (isHTTPError(error)) await failedResponseBody(error.response)
          },
        ],
      },
    })

    this.apiKey = apiKey
    this.apiOrigin = apiOrigin
  }

  async getSwatch(swatchId: string, siteVersion: SiteVersion | null): Promise<Swatch | null> {
    const response = await this.fetch(`v3/swatches/${swatchId}`, siteVersion)

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status === 404) return null

      throw new RestApiClientError(`Failed to get swatch '${swatchId}'`, response, {
        body: failedBody,
        siteVersion,
      })
    }

    const swatch = await response.json()

    return swatch
  }

  async getFile(fileId: string): Promise<File | null> {
    const response = await this.fetch(`v1/files/${fileId}`, null)

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status === 404) return null

      throw new RestApiClientError(`Failed to get file '${fileId}'`, response, {
        body: failedBody,
      })
    }

    const file = await response.json()

    return file
  }

  async getTypography(
    typographyId: string,
    siteVersion: SiteVersion | null,
  ): Promise<Typography | null> {
    const response = await this.fetch(`v3/typographies/${typographyId}`, siteVersion)

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status === 404) return null

      throw new RestApiClientError(`Failed to get typography '${typographyId}'`, response, {
        body: failedBody,
        siteVersion,
      })
    }

    const typography = await response.json()

    return typography
  }

  async getGlobalElement(
    globalElementId: string,
    siteVersion: SiteVersion | null,
  ): Promise<GlobalElement | null> {
    const response = await this.fetch(`v3/global-elements/${globalElementId}`, siteVersion)

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status === 404) return null

      throw new RestApiClientError(`Failed to get global element '${globalElementId}'`, response, {
        body: failedBody,
        siteVersion,
      })
    }

    const globalElement = await response.json()

    return globalElement
  }

  async getLocalizedGlobalElement(
    globalElementId: string,
    locale: string,
    siteVersion: SiteVersion | null,
  ): Promise<LocalizedGlobalElement | null> {
    const response = await this.fetch(
      `v3/localized-global-elements/${globalElementId}?locale=${locale}`,
      siteVersion,
    )

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status === 404) return null

      throw new RestApiClientError(
        `Failed to get localized global element '${globalElementId}'`,
        response,
        { body: failedBody, siteVersion, locale },
      )
    }

    const localizedGlobalElement = await response.json()

    return localizedGlobalElement
  }

  async getPagePathnameSlices(
    pageIds: string[],
    siteVersion: SiteVersion | null,
    { locale }: { locale?: string | null },
  ): Promise<(PagePathnameSlice | null)[]> {
    if (pageIds.length === 0) return []

    const url = new URL(`v3/page-pathname-slices/bulk`, this.apiOrigin)

    pageIds.forEach(id => url.searchParams.append('ids', id))
    if (locale != null) url.searchParams.set('locale', locale)

    const response = await this.fetch(url.pathname + url.search, siteVersion)

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status === 404) return []

      throw new RestApiClientError(
        `Failed to get page pathname slice(s) for ${pageIds.join(', ')}`,
        response,
        { body: failedBody, siteVersion, locale },
      )
    }

    const json = await response.json()

    const pagePathnameSlices = Schema.pagePathnameSlices.parse(json)

    // We're mapping the basePageId to be the id, because we're still using the GraphQL
    // fragment as our APIResource. The id on the APIResource needs to match the pageId
    // so that we can find the corresponding page pathname slice when we call getPagePathnameSlice(pageId).
    // TODO: Update this once we move away from the GraphQL fragments.
    return pagePathnameSlices.map(pagePathnameSlice => {
      if (pagePathnameSlice == null) return null

      return {
        ...pagePathnameSlice,
        id: pagePathnameSlice.basePageId,
        localizedPathname: pagePathnameSlice.localizedPathname ?? null,
      }
    })
  }

  async getPagePathnameSlice(
    pageId: string,
    siteVersion: SiteVersion | null,
    { locale }: { locale?: string | null } = {},
  ): Promise<PagePathnameSlice | null> {
    const pagePathnameSlices = await this.getPagePathnameSlices([pageId], siteVersion, { locale })

    return pagePathnameSlices.at(0) ?? null
  }

  protected async fetch(
    path: string,
    siteVersion: SiteVersion | null,
    init?: RequestInit,
  ): Promise<Response> {
    const requestUrl = new URL(path, this.apiOrigin)

    const requestHeaders = new Headers({
      'x-api-key': this.apiKey,
      'makeswift-site-api-key': this.apiKey,
      'makeswift-runtime-version': PACKAGE_VERSION,
    })

    if (siteVersion?.token) {
      requestUrl.searchParams.set('version', siteVersion.version)
      requestHeaders.set('makeswift-preview-token', siteVersion.token)
    }

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => {
        requestHeaders.set(key, value)
      })
    }

    try {
      return await this._fetch(requestUrl.toString(), {
        ...init,
        headers: requestHeaders,
        ...(siteVersion != null ? { cache: 'no-store' } : {}),
      })
    } catch (error) {
      if (error instanceof HTTPError) return error.response
      throw error
    }
  }
}

// This function attempts to consume the response body of a failed response, and
// returns either the parsed JSON or raw text. This is useful for logging more
// detailed error information when an API request fails.
//
// Cloudflare Worker Note: The Cloudflare Worker runtime has automatic deadlock
// prevention (in the form of auto-cancelling responses) that triggers when too
// many response bodies are unconsumed. This applies for error responses as
// well. As such, in this client we use this function to consume the response
// body whenever the request fails, even if we don't end up logging the body
// itself, to avoid hitting the deadlock prevention.
export async function failedResponseBody(response: Response): Promise<unknown> {
  try {
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  } catch (e) {
    return `Failed to extract response body: ${e}`
  }
}

function responseError(response: Response): string {
  return `${response.status} ${response.statusText}`
}

export class RestApiClientError extends Error {
  readonly status: number

  constructor(message: string, response: Response, cause: Record<string, unknown>) {
    super(`${message}: ${responseError(response)}`, { cause })

    this.name = 'RestApiClientError'
    this.status = response.status
  }
}
