import { z } from 'zod'

export const fonts = z.object({
  // Defaults to empty so responses from hosts that don't yet serve custom font
  // variants still parse, rather than failing and dropping Google Fonts too.
  customFontVariants: z
    .array(
      z.object({
        id: z.string(),
        family: z.string(),
        weight: z.number(),
        style: z.string(),
        fileUrl: z.string().url(),
        fileFormat: z.string(),
      }),
    )
    .default([]),
  googleFonts: z.array(
    z.object({
      family: z.string(),
      variants: z.array(z.string()),
    }),
  ),
  siteId: z.string(),
})
