import { createHash } from 'crypto'

export const PRERENDER_BYPASS_COOKIE = '__prerender_bypass'
export const PREVIEW_DATA_COOKIE = '__next_preview_data'

export const MAKESWIFT_DRAFT_DATA_COOKIE = 'x-makeswift-ref'
export const SET_COOKIE_HEADER = 'set-cookie'

export const SearchParams = {
  Ref: 'x-makeswift-ref',
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

export function jwtKeyFromUuid(uuid: string) {
  return new Uint8Array(createHash('sha256').update(uuid).digest())
}
