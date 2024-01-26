import { NextApiRequest, NextApiResponse } from 'next'

export type Manifest = {
  version: string
  previewMode: boolean
  interactionMode: boolean
  clientSideNavigation: boolean
  elementFromPoint: boolean
  customBreakpoints: boolean
  siteVersions: boolean
  unstable_siteVersions: boolean
  localizedPageSSR: boolean
}

type ManifestError = { message: string }

export type ManifestResponse = Manifest | ManifestError

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ManifestResponse>,
  { apiKey }: { apiKey: string },
): Promise<void> {
  if (req.query.secret !== apiKey) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  return res.json({
    version: PACKAGE_VERSION,
    previewMode: true,
    interactionMode: true,
    clientSideNavigation: true,
    elementFromPoint: false,
    customBreakpoints: true,
    siteVersions: true,
    unstable_siteVersions: true,
    localizedPageSSR: true,
  })
}
