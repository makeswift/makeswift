import { z } from 'zod'

export const swatch = z.object({
  id: z.string(),
  hue: z.number(),
  saturation: z.number(),
  lightness: z.number(),
})

export const file = z.object({
  id: z.string(),
  name: z.string(),
  extension: z.string().nullable(),
  publicUrl: z.string(),
  dimensions: z
    .object({
      width: z.number(),
      height: z.number(),
    })
    .nullable(),
})

export const pagePathnameSlice = z.object({
  id: z.string(),
  pathname: z.string(),
  localizedPathname: z.string().nullable().optional(),
})
