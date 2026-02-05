import { type MakeswiftClient, type GoogleFont } from '../../client'
import { type SiteVersion } from '../../api/site-version'
import { type ApiRequest, ApiResponse } from '../request-response'

export type { GoogleFont }

type GoogleFontsHandlerConfig = {
  client: MakeswiftClient
  siteVersion: SiteVersion | null
}

export async function googleFontsHandler(
  _req: ApiRequest,
  { client, siteVersion }: GoogleFontsHandlerConfig,
): Promise<ApiResponse<GoogleFont[]>> {
  const fonts = await client.getGoogleFonts(siteVersion)
  return ApiResponse.json(fonts)
}
