export const PRERENDER_BYPASS_COOKIE = '__prerender_bypass'
export const PREVIEW_DATA_COOKIE = '__next_preview_data'

export const MAKESWIFT_VERSION_DATA_COOKIE = 'makeswift-version-data'
export const SET_COOKIE_HEADER = 'set-cookie'

export const SearchParams = {
  PreviewToken: 'x-makeswift-preview-token',
} as const

export const cookieSettingOptions = {
  path: '/',
  sameSite: 'none',
  secure: true,
  httpOnly: true,
  partitioned: true,
} as const
