export type TypographyControlData = {
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
} | null

export const TypographyControlType = 'makeswift::controls::typography'

export type TypographyControlDefinition = {
  type: typeof TypographyControlType
}

export function unstable_Typography(): TypographyControlDefinition {
  return {
    type: TypographyControlType,
  }
}
