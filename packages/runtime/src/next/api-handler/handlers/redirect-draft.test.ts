import { NextRequest } from 'next/server'
import { originalRequestProtocol } from './redirect-draft'

describe('redirectDraftRouteHandler', () => {
  describe('correctly extracts original request protocol from the \'x-forwarded-proto\' header', () => {
    test.each([
      [undefined, null],
      ['https', 'https'],
      ['http,https', 'http'],
      ['https, http', 'https'],
      ['https, https,http', 'https'],
      ['https,   https,  http', 'https'],
    ])(`%s -> %s`, (header, expected) => {
      const request = new NextRequest('https://api.makeswift.com', { headers: header != null ? { 'x-forwarded-proto': header } : {} })
      expect(originalRequestProtocol(request)).toEqual(expected)
    })
  })
})
