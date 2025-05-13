// Server-side utilities for Makeswift in Remix

import { createCookie } from '@remix-run/node'

// Create a cookie to store draft mode state
export const makeswiftDraftModeCookie = createCookie('makeswift-draft-mode', {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24, // 24 hours
})

/**
 * Check if draft mode is enabled in the current request
 * 
 * @param request - The request object
 * @returns Whether draft mode is enabled
 */
export async function isDraftModeEnabled(request: Request): Promise<boolean> {
  const cookie = await makeswiftDraftModeCookie.parse(request.headers.get('Cookie'))
  return Boolean(cookie?.enabled)
}

/**
 * Get the site version based on whether draft mode is enabled
 * 
 * @param request - The request object
 * @returns The site version to use
 */
export async function getSiteVersion(request: Request): Promise<'Live' | 'Working'> {
  return (await isDraftModeEnabled(request)) ? 'Working' : 'Live'
}

/**
 * Enable draft mode in the response
 * 
 * @param request - The request object
 * @returns Response headers with draft mode enabled
 */
export async function enableDraftMode(request: Request): Promise<Headers> {
  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    await makeswiftDraftModeCookie.serialize({ enabled: true })
  )
  return headers
}

/**
 * Disable draft mode in the response
 * 
 * @param request - The request object
 * @returns Response headers with draft mode disabled
 */
export async function disableDraftMode(request: Request): Promise<Headers> {
  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    await makeswiftDraftModeCookie.serialize({ enabled: false })
  )
  return headers
}