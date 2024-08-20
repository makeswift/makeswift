import { z } from 'zod'
import { Schema, type ResponsiveValue } from './prop-controllers'

export const colorDataSchema = z.object({
  swatchId: z.string(),
  alpha: z.number(),
})

export type ColorData = z.infer<typeof colorDataSchema>

export const lengthDataSchema = z.object({
  value: z.number(),
  unit: z.enum(['px', '%']),
})

export type LengthData = z.infer<typeof lengthDataSchema>

export const gapDataSchema = z.object({
  value: z.number(),
  unit: z.literal('px'),
})

export type GapData = z.infer<typeof gapDataSchema>

export const responsiveGapDataSchema = Schema.responsiveValue(gapDataSchema)

export type ResponsiveGapData = z.infer<typeof responsiveGapDataSchema>

const fileIdSchema = z.string()

export const imageDataV0Schema = fileIdSchema

export type ImageDataV0 = z.infer<typeof imageDataV0Schema>

const imageDataV1MakeswiftFileSchema = z.object({
  version: z.literal(1),
  type: z.literal('makeswift-file'),
  id: z.string(),
})

const imageDataV1ExternalFileSchema = z.object({
  version: z.literal(1),
  type: z.literal('external-file'),
  url: z.string(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
})

export const imageDataV1Schema = z.union([
  imageDataV1MakeswiftFileSchema,
  imageDataV1ExternalFileSchema,
])

export type ImageDataV1 = z.infer<typeof imageDataV1Schema>

export const imageDataSchema = z.union([imageDataV0Schema, imageDataV1Schema])

export type ImageData = z.infer<typeof imageDataSchema>

export const responsiveNumberValueSchema = Schema.responsiveValue(z.number())

export type ResponsiveNumberValue = z.infer<typeof responsiveNumberValueSchema>

export const responsiveSelectValueSchema = Schema.responsiveValue(z.string())

export type ResponsiveSelectValue<T extends string = string> =
  ResponsiveValue<T>

export const responsiveIconRadioGroupValueSchema = Schema.responsiveValue(
  z.string(),
)

export type ResponsiveIconRadioGroupValue<T extends string = string> =
  ResponsiveValue<T>
