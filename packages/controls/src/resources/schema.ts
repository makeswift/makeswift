import { z } from 'zod'

import { responsiveValue } from '../common/schema'

export const swatch = z.object({
  id: z.string(),
  hue: z.number(),
  saturation: z.number(),
  lightness: z.number(),
})

export const colorData = z.object({
  swatchId: z.string(),
  alpha: z.number(),
})

export const resolvedColorData = z.object({
  swatch,
  alpha: z.number(),
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
  description: z.string().nullable().optional(),
})

export const pagePathnameSlice = z.object({
  id: z.string(),
  pathname: z.string(),
  localizedPathname: z.string().nullable().optional(),
})

export const typography = z.object({
  id: z.string(),
  style: responsiveValue(
    z.object({
      fontFamily: z.string().nullable(),
      lineHeight: z.number().nullable(),
      letterSpacing: z.number().nullable(),
      fontWeight: z.number().nullable(),
      textAlign: z.string().nullable(),
      uppercase: z.boolean().nullable(),
      underline: z.boolean().nullable(),
      strikethrough: z.boolean().nullable(),
      italic: z.boolean().nullable(),
      fontSize: z
        .object({
          value: z.number().nullable(),
          unit: z.string().nullable(),
        })
        .nullable(),
      color: z
        .object({
          swatchId: z.string().nullable(),
          alpha: z.number().nullable(),
        })
        .nullable(),
    }),
  ),
})
