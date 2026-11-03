import { z } from 'zod'

export const customFontVariant = z.object({
  id: z.string(),
  family: z.string(),
  weight: z.number(),
  style: z.string(),
  fileUrl: z.string().url(),
  fileFormat: z.string(),
})

export const googleFont = z.object({
  family: z.string(),
  variants: z.array(z.string()),
})

export const fonts = z.object({
  customFontVariants: z.array(customFontVariant),
  googleFonts: z.array(googleFont),
  siteId: z.string(),
})
