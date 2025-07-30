import { Base64 } from 'js-base64'
import { z } from 'zod'
import { jwtDecode } from 'jwt-decode'

export const ApiHandlerHeaders = {
  SiteVersion: 'X-Makeswift-Site-Version',
}

const decodedTokenPayloadSchema = z.object({
  exp: z.number(),
})

type DecodedTokenPayload = z.infer<typeof decodedTokenPayloadSchema>

export const siteVersionSchema = z.object({
  version: z.string(),
  token: z.string(),
})

export type SiteVersion = z.infer<typeof siteVersionSchema>

function millisecondsToSeconds(seconds: number): number {
  return Math.floor(seconds / 1000)
}

export function serializeSiteVersion(data: SiteVersion): string {
  const jsonString = JSON.stringify({ version: data.version, token: data.token })
  return Base64.encode(jsonString)
}

function getSiteVersionTokenPayload(siteVersion: SiteVersion): DecodedTokenPayload {
  try {
    const decoded = jwtDecode<DecodedTokenPayload>(siteVersion.token)
    return decodedTokenPayloadSchema.parse(decoded)
  } catch (error) {
    console.error('Invalid site version token')
    throw error
  }
}

function isSiteVersionTokenExpired(tokenPayload: DecodedTokenPayload): boolean {
  const currentTime = millisecondsToSeconds(Date.now())
  return currentTime >= tokenPayload.exp
}

export function deserializeSiteVersion(input: string): SiteVersion | null {
  try {
    const jsonString = Base64.decode(input)
    const siteVersion = siteVersionSchema.parse(JSON.parse(jsonString))

    const tokenPayload = getSiteVersionTokenPayload(siteVersion)

    if (isSiteVersionTokenExpired(tokenPayload)) {
      console.error('Site version token is expired')
      return null
    }
    return siteVersion
  } catch {
    console.error('Failed to parse serialized site version:', input)
    return null
  }
}
