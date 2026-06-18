import { z } from 'zod'

export const fonts = z.object({
  googleFonts: z.array(
    z.object({
      family: z.string(),
      variants: z.array(z.string()),
    }),
  ),
  siteId: z.string(),
})
