import { NextRequest } from 'next/server'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import proxyDraftMode from './proxy-draft-mode'
import { env } from 'process';

jest.mock('next/headers', () => ({
  draftMode: jest.fn().mockReturnValue({ enable: jest.fn(), disable: jest.fn() }),
  cookies: jest.fn().mockReturnValue({ get: jest.fn() }),
}))

describe('ForceHTTP proxyDraftMode URL handling', () => {
  const mockApiKey = 'test-api-key'
  
  server.use(
    http.all('*', () => {
      return new HttpResponse()
    })
  )

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

  it('should force protocol to http and use host from `host` from headers instead of `x-forwarded-host`', async () => {
    const originalUrl = new URL(`https://example.com?x-makeswift-draft-mode=${mockApiKey}&keep=this`)
    
    const request = new NextRequest(originalUrl)
    request.headers.append("X-Makeswift-Draft-Mode",mockApiKey )
    request.headers.append("x-forwarded-host", "localhost:3000")

    const originalProtocol = request.nextUrl.protocol
    await proxyDraftMode(request, { params: {} }, { apiKey: mockApiKey })


    // Make sure original request is not changed.
    expect(request.nextUrl.protocol).toBe(originalProtocol)

    // Verify fetch was called with modified URL
    expect(global.fetch).toHaveBeenCalled()
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0] as NextRequest
    
    // Verify host is same as original host.
    expect(fetchCall.headers.get('host')).toBe(request.headers.get('host'))
    
    // Verify https was replaced with http after force_http
    expect(fetchCall.nextUrl.protocol).toBe('http:')
    expect(fetchCall.headers.has('X-Makeswift-Draft-Mode')).toBe(false)
    expect(fetchCall.nextUrl.searchParams.has('x-makeswift-draft-mode')).toBe(false)
    expect(fetchCall.nextUrl.searchParams.get('keep')).toBe('this')
    
  })

})

describe('proxyDraftMode URL handling', () => {
  const mockApiKey = 'test-api-key'
  
  server.use(
    http.all('*', () => {
      return new HttpResponse()
    })
  )

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

  describe('URL mutation safety', () => {
    it('should not modify the original request URL when removing search params', async () => {
      const originalUrl = new URL(`https://example.com?x-makeswift-draft-mode=${mockApiKey}&keep=this`)
      
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
      expect(capturedRequest).not.toBeNull()
      expect(capturedRequest!.headers.has('X-Makeswift-Draft-Mode')).toBe(false)
      const url = new URL(capturedRequest!.url)
      expect(url.searchParams.has('x-makeswift-draft-mode')).toBe(false)
      expect(url.searchParams.get('keep')).toBe('this')
    })
  })
})