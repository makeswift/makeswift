import { serialize as serializeCookie } from 'cookie'
import { type ApiRequest, ApiResponse } from '../request-response'
import { SET_COOKIE_HEADER, cookieSettingOptions } from '../cookies'

export async function clearDraftHandler(
  _req: ApiRequest,
  { draftCookieNames }: { draftCookieNames: string[] },
): Promise<ApiResponse<{ cleared: boolean }>> {
  const headers = new Headers()

  draftCookieNames.forEach(name => {
    headers.append(
      SET_COOKIE_HEADER,
      serializeCookie(name, '', { ...cookieSettingOptions, expires: new Date(0) }),
    )
  })

  return ApiResponse.json({ cleared: true }, { headers })
}
