import { z } from 'zod'

import * as Schema from './schema'

export type PixelLengthData = z.infer<typeof Schema.pixelLength>
export type PercentageData = z.infer<typeof Schema.percentageLength>
export type BorderStyle = z.infer<typeof Schema.borderStyle>
export type BorderSideData = z.infer<typeof Schema.borderSide>
export type ResolvedBorderSideData = z.infer<typeof Schema.resolvedBorderSide>
export type BorderData = z.infer<typeof Schema.border>
export type FontFamilyPropertyData = z.infer<typeof Schema.fontFamily>
export type LetterSpacingPropertyData = z.infer<typeof Schema.letterSpacing>
export type FontSizePropertyData = z.infer<typeof Schema.fontSize>
export type FontWeightPropertyData = z.infer<typeof Schema.fontWeight>
export type TextTransformPropertyData = z.infer<typeof Schema.textTransform>
export type FontStylePropertyData = z.infer<typeof Schema.fontStyle>
export type TextStylePropertyData = z.infer<typeof Schema.textStyle>
export type WidthPropertyData = z.infer<typeof Schema.width>
