import parseSetCookie from 'set-cookie-parser'

export const MakeswiftCookieRiskHeaders = {
  FirstPartyCookies: 'X-Makeswift-Sets-First-Party-Cookies',
  ThirdPartyCookies: 'X-Makeswift-Sets-Third-Party-Cookies',
  ThirdPartyPartitionedCookies: 'X-Makeswift-Sets-Third-Party-Partitioned-Cookies',
} as const

/**
 * Adds additional headers to a response based on the "risk" of that response's
 * Set-Cookie headers. Used for showing warnings in the builder when a response
 * may not be able to set a cookie as expected.
 *
 * @param response
 */
export function attachCookieRiskHeadersToResponse(response: Response): void {
  const cookies = parseSetCookie(response.headers.get('set-cookie') ?? '')

  const hasFirstPartyCookies = cookies.some(c => c.sameSite?.toLowerCase() !== 'none')

  const hasThirdPartyCookies = cookies.some(
    c => c.sameSite?.toLowerCase() === 'none' && c.secure === true,
  )

  const hasThirdPartyPartitionedCookies = cookies.some(
    // @ts-expect-error set-cookie-parser types are missing partitioned
    // attribute. See https://github.com/nfriedly/set-cookie-parser
    c => c.secure === true && c.partitioned === true,
  )

  if (hasFirstPartyCookies) {
    response.headers.set(MakeswiftCookieRiskHeaders.FirstPartyCookies, 'true')
  }

  if (hasThirdPartyCookies) {
    response.headers.set(MakeswiftCookieRiskHeaders.ThirdPartyCookies, 'true')
  }

  if (hasThirdPartyPartitionedCookies) {
    response.headers.set(MakeswiftCookieRiskHeaders.ThirdPartyPartitionedCookies, 'true')
  }
}
