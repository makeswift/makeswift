import { http } from 'msw'
import { server } from '../../mocks/server'
import { NextRequest } from 'next/server'
import {
  createDraftRequest,
  fetchDraftProxyResponse,
  getDraftSecret,
  isDraftModeRequest,
  isPreviewModeRequest,
} from './request-utils'
import {
  InvalidProxyRequestInputError,
  InvariantDraftRequestError,
  MissingDraftEndpointError,
  UnauthorizedDraftRequestError,
  UnknownDraftFetchRequestError,
  UnparseableDraftCookieResponseError,
} from './exceptions'

const TEST_SECRET = 'my-secret-api-key'
const TEST_ORIGIN = 'https://localhost:3001'
const TEST_PATH = `${TEST_ORIGIN}/page`

describe('middleware proxy utils', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  describe('isDraftModeRequest', () => {
    test.each([
      [
        'draft mode search param present',
        new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`)),
        true,
      ],
      [
        'draft mode header present',
        new NextRequest(new URL(TEST_PATH), { headers: { 'X-Makeswift-Draft-Mode': TEST_SECRET } }),
        true,
      ],
      [
        'preview mode search param present',
        new NextRequest(new URL(`${TEST_PATH}?x-makeswift-preview-mode=${TEST_SECRET}`)),
        false,
      ],
      [
        'preview mode header present',
        new NextRequest(new URL(TEST_PATH), {
          headers: { 'X-Makeswift-Preview-Mode': TEST_SECRET },
        }),
        false,
      ],
      ['normal request', new NextRequest(new URL(TEST_PATH)), false],
    ])('request with %s', (_name, request, expected) => {
      expect(isDraftModeRequest(request)).toBe(expected)
    })
  })

  describe('isPreviewModeRequest', () => {
    test.each([
      [
        'draft mode search param present',
        new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`)),
        false,
      ],
      [
        'draft mode header present',
        new NextRequest(new URL(TEST_PATH), { headers: { 'X-Makeswift-Draft-Mode': TEST_SECRET } }),
        false,
      ],
      [
        'preview mode search param present',
        new NextRequest(new URL(`${TEST_PATH}?x-makeswift-preview-mode=${TEST_SECRET}`)),
        true,
      ],
      [
        'preview mode header present',
        new NextRequest(new URL(TEST_PATH), {
          headers: { 'X-Makeswift-Preview-Mode': TEST_SECRET },
        }),
        true,
      ],
      ['normal request', new NextRequest(new URL(TEST_PATH)), false],
    ])('request with %s', (_name, request, expected) => {
      expect(isPreviewModeRequest(request)).toBe(expected)
    })
  })

  describe('getDraftSecret', () => {
    test.each([
      [
        'search param',
        new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`)),
      ],
      [
        'header',
        new NextRequest(new URL(TEST_PATH), {
          headers: { 'X-Makeswift-Draft-Mode': TEST_SECRET },
        }),
      ],
    ])('gets secret from %s', (_name, request) => {
      expect(getDraftSecret(request)).toEqual(TEST_SECRET)
    })

    test('returns null when no secret available', () => {
      const req = new NextRequest(new URL(TEST_PATH))
      expect(getDraftSecret(req)).toBe(null)
    })

    test('throws InvariantRequestError when draft/preview secrets are present', () => {
      const req = new NextRequest(new URL(TEST_PATH), {
        headers: { 'X-Makeswift-Draft-Mode': TEST_SECRET, 'X-Makeswift-Preview-Mode': TEST_SECRET },
      })
      expect(() => getDraftSecret(req)).toThrow(InvariantDraftRequestError)
    })
  })

  describe('createDraftRequest', () => {
    test.each([
      [
        'request secret does not match',
        new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=DOES-NOT-MATCH`)),
      ],
      ['secret is not present', new NextRequest(new URL(TEST_PATH))],
    ])('returns `null` when %s', async (_name, request) => {
      expect(await createDraftRequest(request, TEST_SECRET)).toBe(null)
    })

    test('attaches cookies from draft endpoint to returned request', async () => {
      // Arrange
      const SAMPLE_COOKIE_NAME = '__prerender-bypass'
      const SAMPLE_COOKIE_VALUE = '1234567890'

      server.use(
        http.get(
          `${TEST_ORIGIN}/api/makeswift/draft-mode`,
          () =>
            new Response(null, {
              headers: { 'set-cookie': `${SAMPLE_COOKIE_NAME}=${SAMPLE_COOKIE_VALUE}` },
            }),
        ),
      )

      const req = new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`))

      // Act
      const draftReq = await createDraftRequest(req, TEST_SECRET)

      // Assert
      expect(draftReq?.cookies.get(SAMPLE_COOKIE_NAME)).toEqual({
        name: SAMPLE_COOKIE_NAME,
        value: SAMPLE_COOKIE_VALUE,
      })
      expect(draftReq?.nextUrl.href.includes('x-makeswift-draft-mode')).toBe(false)
      expect(draftReq?.nextUrl.href.includes('x-makeswift-preview-mode')).toBe(false)
      expect(draftReq?.headers.has('x-makeswift-preview-mode')).toBe(false)
      expect(draftReq?.headers.has('x-makeswift-draft-mode')).toBe(false)
    })

    test('throws error if endpoint does not return cookies', async () => {
      // Arrange
      server.use(http.get(`${TEST_ORIGIN}/api/makeswift/draft-mode`, () => new Response(null)))

      const req = new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`))

      // Act
      const draftReq = createDraftRequest(req, TEST_SECRET)

      // Assert
      await expect(draftReq).rejects.toThrow(UnparseableDraftCookieResponseError)
    })

    test('throws MissingDraftEndpointError if endpoint 404s', async () => {
      // Arrange
      server.use(
        http.get(
          `${TEST_ORIGIN}/api/makeswift/draft-mode`,
          () => new Response(null, { status: 404 }),
        ),
      )

      const req = new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`))

      // Act
      const draftReq = createDraftRequest(req, TEST_SECRET)

      // Assert
      await expect(draftReq).rejects.toThrow(MissingDraftEndpointError)
    })

    test('throws UnauthorizedDraftRequestError if endpoint 401s', async () => {
      // Arrange
      server.use(
        http.get(
          `${TEST_ORIGIN}/api/makeswift/draft-mode`,
          () => new Response(null, { status: 401 }),
        ),
      )

      const req = new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`))

      // Act
      const draftReq = createDraftRequest(req, TEST_SECRET)

      // Assert
      await expect(draftReq).rejects.toThrow(UnauthorizedDraftRequestError)
    })

    test.each([
      ['internal server error', 500],
      ['unrecognized status code', 488],
    ])('throws UnknownDraftFetchRequestError if endpoint has %s', async (_name, status) => {
      // Arrange
      server.use(
        http.get(`${TEST_ORIGIN}/api/makeswift/draft-mode`, () => new Response(null, { status })),
      )

      const req = new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`))

      // Act
      const draftReq = createDraftRequest(req, TEST_SECRET)

      // Assert
      await expect(draftReq).rejects.toThrow(UnknownDraftFetchRequestError)
    })
  })

  describe('fetchDraftProxyResponse', () => {
    test.each([
      ['web request', new Request(TEST_PATH)],
      ['NextRequest', new NextRequest(TEST_PATH)],
      ['null', null],
    ])('fails if input is %s', async (_name, req) => {
      // @ts-expect-error Intentionally passing wrong types to simulate JS SDK users
      const response = fetchDraftProxyResponse(req)

      await expect(response).rejects.toThrow(InvalidProxyRequestInputError)
    })

    test('proxied response correctly transfers headers from response', async () => {
      // Arrange
      const SAMPLE_COOKIE_NAME = '__prerender-bypass'
      const SAMPLE_COOKIE_VALUE = '1234567890'

      server.use(
        http.get(
          `${TEST_ORIGIN}/api/makeswift/draft-mode`,
          () =>
            new Response(null, {
              headers: { 'set-cookie': `${SAMPLE_COOKIE_NAME}=${SAMPLE_COOKIE_VALUE}` },
            }),
        ),
      )

      server.use(
        http.get(
          TEST_PATH,
          () => new Response('proxy response body', { headers: { 'x-proxied-sample': '1' } }),
        ),
      )

      const req = new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`))

      // Act
      const draftReq = await createDraftRequest(req, TEST_SECRET)

      // Assert
      expect(draftReq).not.toBeNull()
      if (draftReq == null) return

      const proxyResponse = await fetchDraftProxyResponse(draftReq)
      expect(proxyResponse.headers.has('x-proxied-sample'))
    })
  })
})
