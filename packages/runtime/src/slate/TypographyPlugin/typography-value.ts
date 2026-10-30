import {
  type RichTextTypography,
  type ValueType,
  unstable_Typography,
  type unstable_TypographyDefinition,
} from '@makeswift/controls'

export type TypographyValue = ValueType<unstable_TypographyDefinition>

const definition = unstable_Typography()

/**
 * Typography is read and merged as values, then written back as data, so that
 * the data's version survives normalization.
 */
export function toTypographyValue(data: RichTextTypography): TypographyValue
export function toTypographyValue(data: RichTextTypography | undefined): TypographyValue | undefined
export function toTypographyValue(
  data: RichTextTypography | undefined,
): TypographyValue | undefined {
  return definition.toValue(data)
}

export function toTypographyData(value: TypographyValue): RichTextTypography {
  return definition.toData(value)
}
