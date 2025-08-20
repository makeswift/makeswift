import {
  type ApiRequest,
  type ErrorResponseBody,
  ApiResponse,
  searchParams,
} from '../request-response'

export type Manifest = {
  version: string
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
  { apiKey, manifest }: { apiKey: string; manifest: Partial<Manifest> },
): Promise<ApiResponse<Manifest | ErrorResponseBody>> {
  const secret = searchParams(req).get('secret')

  if (secret !== apiKey) {
    return ApiResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return ApiResponse.json({
    version: PACKAGE_VERSION,
    interactionMode: true,
    clientSideNavigation: false,
    elementFromPoint: false,
    customBreakpoints: true,
    siteVersions: true,
    unstable_siteVersions: true,
    localizedPageSSR: true,
    webhook: true,
    localizedPagesOnlineByDefault: true,
    previewToken: true,
    ...manifest,
  })
}
