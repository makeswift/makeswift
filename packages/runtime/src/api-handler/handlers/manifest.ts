import { type ApiRequest, type ApiResponse, type ErrorResponseBody } from '../request-response'

export type Manifest = {
  version: string
  previewMode: boolean
  draftMode: boolean
  interactionMode: boolean
  clientSideNavigation: boolean
  elementFromPoint: boolean
  customBreakpoints: boolean
  siteVersions: boolean
  unstable_siteVersions: boolean
  localizedPageSSR: boolean
  webhook: boolean
  localizedPagesOnlineByDefault: boolean
}

export async function manifestHandler(
  req: ApiRequest,
  res: ApiResponse,
  { apiKey, manifest }: { apiKey: string; manifest: Partial<Manifest> },
): Promise<ApiResponse<Manifest | ErrorResponseBody>> {
  const secret = req.getSearchParam('secret')

  if (secret !== apiKey) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  return res.json({
    version: PACKAGE_VERSION,
    previewMode: false,
    draftMode: false,
    interactionMode: true,
    clientSideNavigation: false,
    elementFromPoint: false,
    customBreakpoints: true,
    siteVersions: true,
    unstable_siteVersions: true,
    localizedPageSSR: true,
    webhook: true,
    localizedPagesOnlineByDefault: true,
    ...manifest,
  })
}
