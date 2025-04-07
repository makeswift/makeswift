import { NextRequest, NextResponse } from 'next/server'
import {
  InvalidProxyRequestInputError,
  InvariantDraftRequestError,
  MissingDraftEndpointError,
  UnauthorizedDraftRequestError,
  UnknownDraftFetchRequestError,
  UnparseableDraftCookieResponseError,
} from './exceptions'

import { type Cookie, parse as parseSetCookie } from 'set-cookie-parser'

const HeaderNames = {
  DraftMode: 'X-Makeswift-Draft-Mode',
  PreviewMode: 'X-Makeswift-Preview-Mode',
} as const

const SearchParams = {
  DraftMode: 'x-makeswift-draft-mode',
  PreviewMode: 'x-makeswift-preview-mode',
} as const

const CookieRequestEndpoints = {
  DraftMode: '/api/makeswift/draft-mode',
  PreviewMode: '/api/makeswift/preview-mode',
} as const

function getDraftModeSecret(request: NextRequest): string | null {
  return (
    request.nextUrl.searchParams.get(SearchParams.DraftMode) ??
    request.headers.get(HeaderNames.DraftMode) ??
    null
  )
}

function getPreviewModeSecret(request: NextRequest): string | null {
  return (
    request.nextUrl.searchParams.get(SearchParams.PreviewMode) ??
    request.headers.get(HeaderNames.PreviewMode) ??
    null
  )
}

export function isDraftModeRequest(request: NextRequest): boolean {
  return getDraftModeSecret(request) != null
}

export function isPreviewModeRequest(request: NextRequest): boolean {
  return getPreviewModeSecret(request) != null
}

export function isDraftRequest(request: NextRequest): boolean {
  return isDraftModeRequest(request) || isPreviewModeRequest(request)
}

export function getDraftSecret(request: NextRequest): string | null {
  const draftSecret = getDraftModeSecret(request)
  const previewSecret = getPreviewModeSecret(request)
  if (draftSecret != null && previewSecret != null) {
    throw new InvariantDraftRequestError(
      "Request can't include draft mode and preview mode secrets",
    )
  }
  return draftSecret ?? previewSecret
}

async function fetchCookies(url: URL, draftSecret: string): Promise<Cookie[]> {
  const requestUrl = new URL(url)
  requestUrl.searchParams.set('secret', draftSecret)

  const response = await fetch(requestUrl)

  if (!response.ok) {
    if (response.status === 404) {
      throw new MissingDraftEndpointError(
        `Could not find draft endpoint at ${url}. Please make sure you properly registered a \`MakeswiftApiHandler\``,
      )
    }

    let responseText = ''
    try {
      responseText = await response.text()
    } catch (err) {
      console.error('Failed to read draft response body:', err)
      responseText = 'Could not read response body'
    }

    if (response.status === 401) {
      throw new UnauthorizedDraftRequestError(`Unauthorized request to ${url}: ${responseText}`)
    }

    throw new UnknownDraftFetchRequestError(
      `Encountered error (${response.status} - ${response.statusText}) while fetching draft cookies from ${url}: ${responseText}`,
    )
  }

  const setCookieHeader = response.headers.getSetCookie()

  if (setCookieHeader.length <= 0) {
    throw new UnparseableDraftCookieResponseError(
      "Received empty draft cookies. If you're seeing this error, please report a bug to https://github.com/makeswift/makeswift",
    )
  }

  try {
    return parseSetCookie(setCookieHeader)
  } catch (err) {
    throw new UnparseableDraftCookieResponseError(
      "Could not parse draft cookies. If you're seeing this error, please report a bug to https://github.com/makeswift/makeswift",
      { cause: err },
    )
  }
}

async function fetchDraftModeCookies(origin: string, draftSecret: string): Promise<Cookie[]> {
  return await fetchCookies(new URL(CookieRequestEndpoints.DraftMode, origin), draftSecret)
}

async function fetchPreviewModeCookies(origin: string, draftSecret: string): Promise<Cookie[]> {
  return await fetchCookies(new URL(CookieRequestEndpoints.PreviewMode, origin), draftSecret)
}

async function fetchDraftCookies(request: NextRequest, draftSecret: string): Promise<Cookie[]> {
  if (isDraftModeRequest(request)) {
    return await fetchDraftModeCookies(request.nextUrl.origin, draftSecret)
  } else if (isPreviewModeRequest(request)) {
    return await fetchPreviewModeCookies(request.nextUrl.origin, draftSecret)
  }

  return []
}

class MakeswiftDraftRequest extends NextRequest {}

/**
 * Creates a new `NextRequest` that can be used for fetching a working version
 * of the page (that will also bypass the Vercel cache). Returns `null` if the
 * given request does not have a draft secret that matches the `apiKey`.
 */
export async function createDraftRequest(
  requestInit: NextRequest,
  apiKey: string,
): Promise<MakeswiftDraftRequest | null> {
  const requestSecret = getDraftSecret(requestInit)

  if (requestSecret == null || requestSecret !== apiKey) return null

  const draftCookies = await fetchDraftCookies(requestInit, requestSecret)

  // https://github.com/vercel/next.js/issues/52967#issuecomment-1644675602
  // if we don't pass request twice, headers are stripped
  const draftRequest = new MakeswiftDraftRequest(requestInit, requestInit)

  draftCookies.forEach(({ name, value }) => {
    draftRequest.cookies.set(name, value)
  })

  draftRequest.nextUrl.searchParams.delete(SearchParams.DraftMode)
  draftRequest.nextUrl.searchParams.delete(SearchParams.PreviewMode)
  draftRequest.headers.delete(HeaderNames.DraftMode)
  draftRequest.headers.delete(HeaderNames.PreviewMode)

  return draftRequest
}

export async function fetchDraftProxyResponse(
  draftRequest: MakeswiftDraftRequest,
): Promise<NextResponse> {
  if (!(draftRequest instanceof MakeswiftDraftRequest)) {
    throw new InvalidProxyRequestInputError(
      'Draft request must be instance of `MakeswiftDraftRequest`',
    )
  }
  // Passing `draftRequest.nextUrl` to fetch directly won't work when deployed
  // on Vercel - it results in a `TypeError: Invalid URL` error. Constructing
  // the URL works.
  const proxyUrl = new URL(draftRequest.nextUrl, draftRequest.nextUrl.origin)
  const proxyResponse = await fetch(proxyUrl, { headers: draftRequest.headers })

  const response = new NextResponse(proxyResponse.body, {
    headers: proxyResponse.headers,
    status: proxyResponse.status,
  })

  // `fetch` automatically decompresses the response, but the response headers
  // will keep the `content-encoding` and `content-length` headers. This will
  // cause decoding issues if the client attempts to decompress the response
  // again. To prevent  this, we remove these headers.
  //
  // See https://github.com/nodejs/undici/issues/2514.
  if (response.headers.has('content-encoding')) {
    response.headers.delete('content-encoding')
    response.headers.delete('content-length')
  }

  return response
}
