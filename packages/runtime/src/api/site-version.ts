import { z } from 'zod'

export const makeswiftSiteVersionSchema = z.enum(['Live', 'Working'])
export const MakeswiftSiteVersion = makeswiftSiteVersionSchema.Enum
export type MakeswiftSiteVersion = z.infer<typeof makeswiftSiteVersionSchema>

export const API_HANDLER_SITE_VERSION_HEADER = 'X-Makeswift-Site-Version'
