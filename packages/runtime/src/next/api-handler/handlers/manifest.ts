import { NextApiRequest, NextApiResponse } from 'next'
import { version } from '../../../../package.json'

export type Manifest = {
  version: string
  previewMode: boolean
  interactionMode: boolean
  clientSideNavigation: boolean
  elementFromPoint: boolean
  customBreakpoints: boolean
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
    version,
    previewMode: true,
    interactionMode: true,
    clientSideNavigation: true,
    elementFromPoint: false,
    customBreakpoints: true,
  })
}
