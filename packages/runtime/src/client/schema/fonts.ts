import { z } from 'zod'

export const customFontVariant = z.object({
  id: z.string(),
  family: z.string(),
  weight: z.union([
    z.literal(100),
    z.literal(200),
    z.literal(300),
    z.literal(400),
    z.literal(500),
    z.literal(600),
    z.literal(700),
    z.literal(800),
    z.literal(900),
  ]),
  style: z.enum(['normal', 'italic']),
  fileUrl: z.string().url(),
  fileFormat: z.enum(['woff2', 'woff', 'ttf', 'otf']),
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
