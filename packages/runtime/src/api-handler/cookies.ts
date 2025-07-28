export const SET_COOKIE_HEADER = 'set-cookie'

export const cookieSettingOptions = {
  path: '/',
  sameSite: 'none',
  secure: true,
  httpOnly: true,
  partitioned: true,
} as const
