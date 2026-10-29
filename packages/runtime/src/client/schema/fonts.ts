import { z } from 'zod'

const customFontVariant = z.object({
  id: z.string(),
  family: z.string(),
  weight: z.number(),
  style: z.string(),
  fileUrl: z.string().url(),
  fileFormat: z.string(),
})

export const fonts = z.object({
  // Variants are parsed one at a time and invalid ones are skipped, so a bad variant doesn't fail
  // the whole response and drop Google Fonts too. Defaults to empty so responses from hosts that
  // don't yet serve custom font variants still parse.
  customFontVariants: z
    .array(z.unknown())
    .default([])
    .transform(variants =>
      variants.flatMap(variant => {
        const parsed = customFontVariant.safeParse(variant)
        if (parsed.success) return [parsed.data]

        console.error('Skipping invalid custom font variant', { variant })
        return []
      }),
    ),
  googleFonts: z.array(
    z.object({
      family: z.string(),
      variants: z.array(z.string()),
    }),
  ),
  siteId: z.string(),
})
