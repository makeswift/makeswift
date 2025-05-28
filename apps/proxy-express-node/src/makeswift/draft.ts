// TODO: Move this file to @makeswift/express
import { Request, Response } from 'express'

const MAKESWIFT_DRAFT_DATA_COOKIE = 'x-makeswift-draft-data'

type MakeswiftSiteVersion = 'Live' | 'Working'

interface DraftData {
  makeswift: boolean
  siteVersion: MakeswiftSiteVersion
}

export function getSiteVersion(req: Request): MakeswiftSiteVersion {
  const draftData = getDraftData(req)
  return draftData?.siteVersion ?? 'Live'
}

export function isDraftModeEnabled(req: Request): boolean {
  return getDraftData(req) !== null
}

function getDraftData(req: Request): DraftData | null {
  const draftDataCookie = req.cookies[MAKESWIFT_DRAFT_DATA_COOKIE]

  if (!draftDataCookie) {
    return null
  }

  try {
    const decoded = Buffer.from(draftDataCookie, 'base64').toString('utf-8')
    return JSON.parse(decoded) as DraftData
  } catch {
    return null
  }
}

const cookieOptions = {
  path: '/',
  sameSite: 'none',
  secure: true,
  httpOnly: true,
  partitioned: true,
} as const

function setDraftModeCookies(
  res: Response,
  siteVersion: MakeswiftSiteVersion = 'Working',
) {
  const draftData: DraftData = {
    makeswift: true,
    siteVersion,
  }

  const encodedData = Buffer.from(JSON.stringify(draftData)).toString('base64')
  res.cookie(MAKESWIFT_DRAFT_DATA_COOKIE, encodedData, cookieOptions)
}

function clearDraftModeCookies(res: Response) {
  res.clearCookie(MAKESWIFT_DRAFT_DATA_COOKIE, {
    ...cookieOptions,
    expires: new Date(0),
  })
}

export function draftModeMiddleware(
  req: Request,
  res: Response,
  next: () => void,
) {
  if (req.path === '/api/makeswift/clear-draft') {
    return clearDraftHandler(req, res)
  }

  const draftModeSecret = req.query['x-makeswift-draft-mode']

  if (draftModeSecret) {
    req.query.redirect = req.path
    req.query.secret = draftModeSecret
    delete req.query['x-makeswift-draft-mode']

    return draftHandler(req, res)
  }

  next()
}

function draftHandler(req: Request, res: Response) {
  const apiKey = process.env.MAKESWIFT_SITE_API_KEY
  const secret = req.query.secret || req.body?.secret

  if (!apiKey || secret !== apiKey) {
    return res.status(401).json({ error: 'Invalid secret' })
  }

  setDraftModeCookies(res)

  const redirectUrl = req.query.redirect || req.body?.redirect || '/'
  res.redirect(redirectUrl)
}

function clearDraftHandler(req: Request, res: Response) {
  clearDraftModeCookies(res)
  res.json({ success: true })
}
