import { z } from 'zod'

export const MakeswiftVersionRefs = {
  Live: 'ref:live',
  Working: 'ref:draft',
}

export const versionDataPayloadSchema = z.object({
  makeswift: z.literal(true),
  version: z.string(),
  token: z.string(),
})

export type MakeswiftVersionData = z.infer<typeof versionDataPayloadSchema>

export const ApiHandlerHeaders = {
  SiteVersion: 'X-Makeswift-Site-Version',
  PreviewToken: 'X-Makeswift-Preview-Token',
}
