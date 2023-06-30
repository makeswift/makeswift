import { isNonNullable } from '../utils/isNonNullable'

export type TypographyControlData = (
  | {
      id?: string
      style: Array<{
        deviceId: string
        value: {
          fontFamily?: string | null
          lineHeight?: number | null
          letterSpacing?: number | null
          fontWeight?: number | null
          textAlign?: string | null
          uppercase?: boolean | null
          underline?: boolean | null
          strikethrough?: boolean | null
          italic?: boolean | null
          fontSize?: { value: number | null; unit: string | null } | null
          color?: { swatchId: string | null; alpha: number | null } | null
        }
      }>
    }
  | undefined
)[]

export const TypographyControlType = 'makeswift::controls::typography'

export type TypographyControlDefinition = {
  type: typeof TypographyControlType
}

export function unstable_Typography(): TypographyControlDefinition {
  return {
    type: TypographyControlType,
  }
}

export function getTypographySwatchIds(value: TypographyControlData[number]) {
  return (
    value?.style.flatMap(style => style.value.color?.swatchId ?? []).filter(isNonNullable) ?? []
  )
}

export function getTypographyTypographyIds(value: TypographyControlData[number]) {
  return [value?.id].filter(isNonNullable)
}
