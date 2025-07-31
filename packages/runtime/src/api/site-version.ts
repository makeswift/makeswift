import { z } from 'zod'

export const ApiHandlerHeaders = {
  SiteVersion: 'X-Makeswift-Site-Version',
  PreviewToken: 'X-Makeswift-Preview-Token',
}

export const versionDataPayloadSchema = z.object({
  version: z.string(),
  token: z.string(),
})

export type MakeswiftVersionData = z.infer<typeof versionDataPayloadSchema>

export function serializeSiteVersion(data: MakeswiftVersionData): string {
  return JSON.stringify({ version: data.version, token: data.token })
}

export function deserializeSiteVersion(input: string): MakeswiftVersionData | null {
  try {
    const json = JSON.parse(input)
    return versionDataPayloadSchema.parse(json)
  } catch {
    console.error('Failed to parse Makeswift site version data:', input)
    return null
  }
}
