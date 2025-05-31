// TODO: Move this file to @makeswift/express
import { Request, Response } from 'express'

export function makeswiftApiHandlerMiddleware(
  req: Request,
  res: Response,
  next: () => void,
) {
  if (req.path === '/api/makeswift/manifest') {
    return res.json({
      version: '0.24.5',
      previewMode: false,
      draftMode: true,
      interactionMode: true,
      clientSideNavigation: false,
      elementFromPoint: false,
      customBreakpoints: true,
      siteVersions: true,
      unstable_siteVersions: true,
      localizedPageSSR: true,
      webhook: true,
      localizedPagesOnlineByDefault: true,
    })
  }

  if (req.path === '/api/makeswift/fonts') {
    return res.json([])
  }

  next()
}
