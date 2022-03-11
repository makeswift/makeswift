import type { ColorValue } from '../utils/types'
import type { Length as LengthValue } from '../../prop-controllers'
import { DeviceOverride } from '../../prop-controllers'
import { TYPOGRAPHIES_BY_ID } from '../utils/queries'
import { useQuery } from '../../api/react'

export type TypographyStyleValue = {
  fontFamily?: string
  fontWeight?: number
  fontSize?: LengthValue
  color?: ColorValue
  textAlign?: string
  lineHeight?: number
  letterSpacing?: number
  uppercase?: boolean
  underline?: boolean
  strikethrough?: boolean
  italic?: boolean
}

export type TypographyStyle = Array<DeviceOverride<TypographyStyleValue>>

export type Typography = {
  id: string
  name: string
  style: TypographyStyle
}

export function useTypography(
  typographyId: string | null | undefined,
): Typography | null | undefined {
  const { error, data } = useQuery(TYPOGRAPHIES_BY_ID, {
    skip: typographyId == null,
    variables: { ids: typographyId != null ? [typographyId] : [] },
  })

  if (typographyId == null || error != null) return null

  return data?.typographies[0] as Typography | null
}
