export const PRERENDER_BYPASS_COOKIE = '__prerender_bypass'
export const PREVIEW_DATA_COOKIE = '__next_preview_data'

export const MAKESWIFT_DRAFT_DATA_COOKIE = 'x-makeswift-draft-data'
export const SET_COOKIE_HEADER = 'set-cookie'

export const SearchParams = {
  DraftMode: 'x-makeswift-draft-mode',
  PreviewMode: 'x-makeswift-preview-mode',
} as const

export const cookieSettingOptions = {
  path: '/',
  sameSite: 'none',
  secure: true,
  httpOnly: true,
  partitioned: true,
} as const
