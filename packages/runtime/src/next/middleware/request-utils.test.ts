import { NextRequest } from 'next/server'
import { isDraftModeRequest } from './request-utils'

const TEST_PREVIEW_TOKEN = 'test-preview-token'
const TEST_ORIGIN = 'https://localhost:3001'
const TEST_PATH = `${TEST_ORIGIN}/page`

describe('middleware utils', () => {
  describe('isDraftModeRequest', () => {
    test.each([
      [
        'only token search param present',
        new NextRequest(new URL(`${TEST_PATH}?x-makeswift-preview-token=${TEST_PREVIEW_TOKEN}`)),
        true,
      ],
      [
        'both draft cookies present',
        new NextRequest(new URL(TEST_PATH), {
          headers: {
            cookie: `__prerender_bypass=123456; makeswift-site-version={"version":"ref:working", "token":"${TEST_PREVIEW_TOKEN}"}`,
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
          headers: {
            cookie: `makeswift-site-version={"version":"ref:working", "token":"${TEST_PREVIEW_TOKEN}"}`,
          },
        }),
        false,
      ],
      ['normal request', new NextRequest(new URL(TEST_PATH)), false],
    ])('request with %s', (_name, request, expected) => {
      expect(isDraftModeRequest(request)).toBe(expected)
    })
  })
})
