import { NextRequest } from 'next/server'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import proxyDraftMode from './proxy-draft-mode'
import { env } from 'process'

jest.mock('next/headers', () => ({
  draftMode: jest.fn().mockReturnValue({ enable: jest.fn(), disable: jest.fn() }),
  cookies: jest.fn().mockReturnValue({ get: jest.fn() }),
}))

const mockApiKey = 'test-api-key'

describe('ForceHTTP proxyDraftMode URL handling', () => {
  it('should force protocol to http and use host from `host` from headers instead of `x-forwarded-host`', async () => {
    try {
      env.FORCE_HTTP = 'true'
      const originalUrl = new URL(`https://example.com?x-makeswift-draft-mode=${mockApiKey}&keep=this`)
    
      let capturedRequest: NextRequest | null = null
        server.use(
          http.all('*', ({ request }) => {
            capturedRequest = new NextRequest(request)
            return new HttpResponse()
          })
        )

      const request = new NextRequest(originalUrl)
      request.headers.append("X-Makeswift-Draft-Mode",mockApiKey )
      request.headers.append("x-forwarded-host", "localhost:3000")

      const originalProtocol = request.nextUrl.protocol
      
      await proxyDraftMode(request, { params: {} }, { apiKey: mockApiKey })


      // Make sure original request is not changed.
      expect(request.nextUrl.protocol).toBe(originalProtocol)
      expect(capturedRequest).not.toBeNull()

      // Verify host is same as original host.
      expect(capturedRequest!.headers.get('host')).toBe(request.headers.get('host'))
      expect(capturedRequest!.headers.has('X-Makeswift-Draft-Mode')).toBe(false)

      // Verify https was replaced with http after force_http
      expect(capturedRequest!.nextUrl.protocol).toBe('http:')
      expect(capturedRequest!.nextUrl.searchParams.has('x-makeswift-draft-mode')).toBe(false)
      expect(capturedRequest!.nextUrl.searchParams.get('keep')).toBe('this')
    } finally {
      env.FORCE_HTTP = undefined
    }
  })
})

describe('proxyDraftMode URL mutation safety', () => {
    beforeAll(() => {
      server.listen()
    })
    
    afterAll(() => {
      server.close()
    })
    
    afterEach(() => {
      server.resetHandlers()
      jest.clearAllMocks()
    })

    it('should not modify the original request URL when removing search params', async () => {
      const originalUrl = new URL(`https://example.com?x-makeswift-draft-mode=${mockApiKey}&keep=this`)
      server.use(
        http.all('*', () => {
          return new HttpResponse()
        })
      )
      const request = new NextRequest(originalUrl)
      request.headers.append("X-Makeswift-Draft-Mode", mockApiKey)

      const originalSearchParams = new URLSearchParams(request.nextUrl.search)
      const originalHeaders = new Headers(request.headers)

      await proxyDraftMode(request, { params: {} }, { apiKey: mockApiKey })

      // Verify original request URL remains unchanged
      expect(request.nextUrl.searchParams.toString()).toBe(originalSearchParams.toString())
      expect(JSON.stringify(request.headers)).toBe(JSON.stringify(originalHeaders))
    })

    it('should clone the original request URL by removing makeswift header and searchparam', async () => {
      const originalUrl = new URL(`https://example.com?x-makeswift-draft-mode=${mockApiKey}&keep=this`)
      
      let capturedRequest: Request | null = null
      server.use(
        http.all('*', ({ request }) => {
          capturedRequest = request
          return new HttpResponse()
        })
      )
      
      const request = new NextRequest(originalUrl)
      request.headers.append("X-Makeswift-Draft-Mode", mockApiKey)
  
      await proxyDraftMode(request, { params: {} }, { apiKey: mockApiKey })

      // Verify request was modified correctly
      expect(capturedRequest!.headers.has('X-Makeswift-Draft-Mode')).toBe(false)
      const url = new URL(capturedRequest!.url)
      expect(url.searchParams.has('x-makeswift-draft-mode')).toBe(false)
      expect(url.searchParams.get('keep')).toBe('this')
    })
})
