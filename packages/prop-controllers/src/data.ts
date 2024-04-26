import { z } from 'zod'
import { createResponsiveValueSchema } from './prop-controllers'

export const colorDataSchema = z.object({
  swatchId: z.string(),
  alpha: z.number(),
})

export type ColorData = z.infer<typeof colorDataSchema>

export const lengthDataSchema = z.object({
  value: z.number(),
  unit: z.union([z.literal('px'), z.literal('%')]),
})

export type LengthData = z.infer<typeof lengthDataSchema>

export const gapDataSchema = z.object({
  value: z.number(),
  unit: z.literal('px'),
})

export type GapData = z.infer<typeof gapDataSchema>

export const responsiveGapDataSchema =
  createResponsiveValueSchema(gapDataSchema)

export type ResponsiveGapData = z.infer<typeof responsiveGapDataSchema>
