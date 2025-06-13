import { serialize as serializeCookie } from 'cookie'
import { type ApiRequest, type ApiResponse } from '../request-response'
import { SET_COOKIE_HEADER, cookieSettingOptions } from '../cookies'

export async function clearDraftHandler(
  _req: ApiRequest,
  res: ApiResponse,
  { draftCookieNames }: { draftCookieNames: string[] },
): Promise<ApiResponse<{ cleared: boolean }>> {
  draftCookieNames.forEach(name => {
    res.setHeader(
      SET_COOKIE_HEADER,
      serializeCookie(name, '', { ...cookieSettingOptions, expires: new Date(0) }),
    )
  })

  return res.json({ cleared: true })
}
