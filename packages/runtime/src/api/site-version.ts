import { Base64 } from 'js-base64'
import { z } from 'zod'

export const ApiHandlerHeaders = {
  SiteVersion: 'X-Makeswift-Site-Version',
}

export const siteVersionSchema = z.object({
  version: z.string(),
  token: z.string(),
})

export type SiteVersion = z.infer<typeof siteVersionSchema>

export function serializeSiteVersion(data: SiteVersion): string {
  const jsonString = JSON.stringify({ version: data.version, token: data.token })
  return Base64.encode(jsonString)
}

export function deserializeSiteVersion(input: string): SiteVersion | null {
  try {
    const jsonString = Base64.decode(input)
    return siteVersionSchema.parse(JSON.parse(jsonString))
  } catch {
    console.error('Failed to parse serialized site version:', input)
    return null
  }
}
