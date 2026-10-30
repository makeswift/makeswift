import { z } from 'zod'

import { responsiveValue } from '../../common/schema'
import { ResourceSchema } from '../../resources'

export const colorData = z.object({
  swatchId: z.string().nullable(),
  alpha: z.number().nullable(),
})

export const swatchColorData = colorData.extend({ type: z.literal('swatch') })

export const colorDataV2 = z.discriminatedUnion('type', [
  swatchColorData,
  ResourceSchema.inlineColorData,
])

export function responsiveStyle<C extends z.ZodTypeAny>(color: C) {
  return responsiveValue(
    z.object({
      fontFamily: z.string().nullable().optional(),
      lineHeight: z.number().nullable().optional(),
      letterSpacing: z.number().nullable().optional(),
      fontWeight: z.number().nullable().optional(),
      textAlign: z.string().nullable().optional(),
      uppercase: z.boolean().nullable().optional(),
      underline: z.boolean().nullable().optional(),
      strikethrough: z.boolean().nullable().optional(),
      italic: z.boolean().nullable().optional(),
      fontSize: z
        .object({
          value: z.number().nullable(),
          unit: z.string().nullable(),
        })
        .nullable()
        .optional(),
      color: color.optional(),
    }),
  )
}

export const resolvedStyle = responsiveStyle(
  z
    .object({
      swatch: z
        .object({
          hue: z.number(),
          saturation: z.number(),
          lightness: z.number(),
        })
        .optional(),
      alpha: z.number().optional(),
    })
    .optional(),
)

export function typography<C extends z.ZodTypeAny>(color: C) {
  return z.object({
    id: z.string().optional(),
    style: responsiveStyle(color),
  })
}
