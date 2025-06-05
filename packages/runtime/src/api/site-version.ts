import { z } from 'zod'

export const makeswiftSiteVersionSchema = z.enum(['Live', 'Working'])
export const MakeswiftSiteVersion = makeswiftSiteVersionSchema.Enum
export type MakeswiftSiteVersion = z.infer<typeof makeswiftSiteVersionSchema>

export const API_HANDLER_SITE_VERSION_HEADER = 'X-Makeswift-Site-Version'

export const siteRefSchema = z.union([
  z.object({ siteVersion: makeswiftSiteVersionSchema }),
  z.object({ commitId: z.string() }),
])
export type SiteRef = z.infer<typeof siteRefSchema>
