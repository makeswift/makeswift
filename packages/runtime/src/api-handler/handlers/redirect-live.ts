import { serialize as serializeCookie } from 'cookie'
import { type ApiRequest, ApiResponse, searchParams } from '../request-response'
import { SET_COOKIE_HEADER, cookieSettingOptions } from '../cookies'

const REDIRECT_SEARCH_PARAM = 'makeswift-redirect-live'

export async function redirectLiveHandler(
  req: ApiRequest,
  { previewCookieNames }: { previewCookieNames: string[] },
): Promise<ApiResponse<null>> {
  const params = searchParams(req)
  const redirectDestination = params.get(REDIRECT_SEARCH_PARAM) ?? '/'

  const redirectDestinationUrl = new URL(
    decodeURIComponent(redirectDestination),
    'http://localhost',
  )
  redirectDestinationUrl.searchParams.delete(REDIRECT_SEARCH_PARAM)

  const destinationPath = `${redirectDestinationUrl.pathname}${redirectDestinationUrl.search}${redirectDestinationUrl.hash}`

  const headers = new Headers()

  previewCookieNames.forEach(name => {
    headers.append(
      SET_COOKIE_HEADER,
      serializeCookie(name, '', { ...cookieSettingOptions, expires: new Date(0), maxAge: 0 }),
    )
  })

  return ApiResponse.redirect(destinationPath, { headers })
}
