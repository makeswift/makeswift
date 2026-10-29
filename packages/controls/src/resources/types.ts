import { z } from 'zod'

import * as Schema from './schema'

export type Swatch = z.infer<typeof Schema.swatch>
export type ColorData = z.infer<typeof Schema.colorData>
export type SwatchColorData = z.infer<typeof Schema.swatchColorData>
export type InlineColorData = z.infer<typeof Schema.inlineColorData>
export type ColorDataV2 = z.infer<typeof Schema.colorDataV2>
export type NullableColorData = z.infer<typeof Schema.nullableColorData>
export type NullableSwatchColorData = z.infer<
  typeof Schema.nullableSwatchColorData
>
export type NullableColorDataV2 = z.infer<typeof Schema.nullableColorDataV2>
export type ResolvedColorData = z.infer<typeof Schema.resolvedColorData>
export type ResolvedInlineColorData = z.infer<
  typeof Schema.resolvedInlineColorData
>
export type File = z.infer<typeof Schema.file>
export type PagePathnameSlice = z.infer<typeof Schema.pagePathnameSlice>
export type Typography = z.infer<typeof Schema.typography>
