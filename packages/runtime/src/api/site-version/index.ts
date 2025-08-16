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

function millisecondsToSeconds(ms: number): number {
  return Math.floor(ms / 1000)
}

export function serializeSiteVersion(data: SiteVersion): string {
  const jsonString = JSON.stringify({ version: data.version, token: data.token })
  return jsonString
}

function parseSerializedSiteVersion(input: string): SiteVersion | null {
  try {
    return siteVersionSchema.parse(JSON.parse(input))
  } catch {
    console.error('Failed to parse serialized site version:', input)
    return null
  }
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

function secondsUntilTokenExpiration(tokenPayload: DecodedTokenPayload): number {
  const currentTime = millisecondsToSeconds(Date.now())
  return Math.max(tokenPayload.exp - currentTime, 0)
}

export function secondsUntilSiteVersionExpiration(siteVersion: SiteVersion): number {
  try {
    const tokenPayload = getSiteVersionTokenPayload(siteVersion)
    return secondsUntilTokenExpiration(tokenPayload)
  } catch (error) {
    console.error('Failed to check site version expiration:', error)
    return 0
  }
}

function isSiteVersionExpired(siteVersion: SiteVersion): boolean {
  return secondsUntilSiteVersionExpiration(siteVersion) <= 0
}

export function deserializeSiteVersion(input: string): SiteVersion | null {
  try {
    const parsedSiteVersion = parseSerializedSiteVersion(input)
    if (parsedSiteVersion == null) return null

    if (isSiteVersionExpired(parsedSiteVersion)) {
      console.error('Site version token is expired')
      return null
    }
    return parsedSiteVersion
  } catch {
    console.error('Failed to deserialize site version:', input)
    return null
  }
}
