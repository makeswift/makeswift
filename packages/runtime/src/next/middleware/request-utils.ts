import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  InvalidDraftResponseBodyError,
  InvariantDraftRequestError,
  MiddlewareError,
  MissingDraftEndpointError,
  UnauthorizedDraftRequestError,
  UnknownDraftFetchRequestError,
  UnparseableDraftCookieResponseError,
} from './exceptions'

const HeaderNames = {
  DraftMode: 'X-Makeswift-Draft-Mode',
  PreviewMode: 'X-Makeswift-Preview-Mode',
} as const

const SearchParams = {
  DraftMode: 'x-makeswift-draft-mode',
  PreviewMode: 'x-makeswift-preview-mode',
} as const

const CookieRequestEndpoints = {
  DraftMode: '/api/makeswift/draft-mode-cookies',
  PreviewMode: '/api/makeswift/preview-mode-cookies',
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

const cookiesResponseSchema = z.object({
  cookies: z.array(z.object({ name: z.string(), value: z.string() })),
})

type CookiesResponse = z.infer<typeof cookiesResponseSchema>

async function fetchCookies(url: URL, draftSecret: string): Promise<CookiesResponse> {
  const requestUrl = new URL(url)
  requestUrl.searchParams.set('secret', encodeURIComponent(draftSecret))

  const response = await fetch(requestUrl)
    .then(res => {
      if (res.ok) return res
      if (res.status === 401) {
        throw new UnauthorizedDraftRequestError(`Unauthorized draft request to ${url}`)
      }
      if (res.status === 404) {
        throw new MissingDraftEndpointError(
          `Could not find draft endpoint at ${url}. Please make sure you properly registered a \`MakeswiftApiHandler\``,
        )
      }
      throw new UnknownDraftFetchRequestError(
        'Encountered unknown error while fetching draft cookies',
      )
    })
    .catch(err => {
      if (err instanceof MiddlewareError) throw err
      const exception = new UnknownDraftFetchRequestError(
        'Encountered unknown error while fetching draft cookies',
      )
      exception.cause = err
      throw exception
    })

  const data = await response.json().catch(() => {
    throw new InvalidDraftResponseBodyError('Draft cookie response was not a valid JSON body')
  })

  const parsedData = cookiesResponseSchema.safeParse(data)

  if (!parsedData.success) {
    throw new UnparseableDraftCookieResponseError(
      `Could not parse cookie response from ${url}. If you're seeing this error, please report a bug to https://github.com/makeswift/makeswift`,
    )
  }

  return parsedData.data
}

async function fetchDraftModeCookies(
  origin: string,
  draftSecret: string,
): Promise<CookiesResponse> {
  return await fetchCookies(new URL(CookieRequestEndpoints.DraftMode, origin), draftSecret)
}

async function fetchPreviewModeCookies(
  origin: string,
  draftSecret: string,
): Promise<CookiesResponse> {
  return await fetchCookies(new URL(CookieRequestEndpoints.PreviewMode, origin), draftSecret)
}

async function fetchDraftCookies(
  request: NextRequest,
  draftSecret: string,
): Promise<CookiesResponse> {
  if (isDraftModeRequest(request)) {
    return await fetchDraftModeCookies(request.nextUrl.origin, draftSecret)
  }

  if (isPreviewModeRequest(request)) {
    return await fetchPreviewModeCookies(request.nextUrl.origin, draftSecret)
  }

  return { cookies: [] }
}

export async function createDraftRequest(
  requestInit: NextRequest,
  draftSecret: string,
): Promise<NextRequest> {
  const draftCookies = await fetchDraftCookies(requestInit, draftSecret)

  // https://github.com/vercel/next.js/issues/52967#issuecomment-1644675602
  // if we don't pass request twice, headers are stripped
  const draftRequest = new NextRequest(requestInit, requestInit)

  draftCookies.cookies.forEach(({ name, value }) => {
    draftRequest.cookies.set(name, value)
  })

  return draftRequest
}
