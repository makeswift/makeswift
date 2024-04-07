import { z } from 'zod'

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
