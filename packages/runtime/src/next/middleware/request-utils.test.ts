import { NextRequest } from 'next/server'
import { isDraftModeRequest } from './request-utils'

const TEST_SECRET = 'my-secret-api-key'
const TEST_ORIGIN = 'https://localhost:3001'
const TEST_PATH = `${TEST_ORIGIN}/page`

describe('middleware utils', () => {
  describe('isDraftModeRequest', () => {
    test.each([
      [
        'only draft mode search param present',
        new NextRequest(new URL(`${TEST_PATH}?x-makeswift-draft-mode=${TEST_SECRET}`)),
        true,
      ],
      [
        'only draft mode header present',
        new NextRequest(new URL(TEST_PATH), { headers: { 'X-Makeswift-Draft-Mode': TEST_SECRET } }),
        true,
      ],
      [
        'both draft cookies present',
        new NextRequest(new URL(TEST_PATH), {
          headers: {
            cookie: `__prerender_bypass=123456; x-makeswift-draft-data={"makeswift":true,"siteVersion":"Working"}`,
          },
        }),
        true,
      ],
      [
        'only bypass cookie present',
        new NextRequest(new URL(TEST_PATH), { headers: { cookie: `__prerender_bypass=123456;` } }),
        false,
      ],
      [
        'only draft data cookie present',
        new NextRequest(new URL(TEST_PATH), {
          headers: { cookie: `x-makeswift-draft-data={"makeswift":true,"siteVersion":"Working"}` },
        }),
        false,
      ],
      [
        'only preview mode search param present',
        new NextRequest(new URL(`${TEST_PATH}?x-makeswift-preview-mode=${TEST_SECRET}`)),
        false,
      ],
      [
        'only preview mode header present',
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
})
