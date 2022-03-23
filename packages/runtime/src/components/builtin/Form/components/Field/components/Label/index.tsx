import { ComponentPropsWithoutRef } from 'react'
import styled, { css } from 'styled-components'
import { ResponsiveValue } from '../../../../../../../prop-controllers'
import { TextStyleValue } from '../../../../../../../prop-controllers/descriptors'
import { cssMediaRules, cssTextStyle } from '../../../../../../utils/cssMediaRules'
import { colorToString } from '../../../../../../utils/colorToString'

import { useFormContext, Size, Sizes, Contrast, Contrasts } from '../../../../context/FormContext'
import { useColor } from '../../../../../../hooks'
import { ColorValue } from '../../../../../../utils/types'

export function getSizeHeight(size: Size): number {
  switch (size) {
    case Sizes.SMALL:
      return 14

    case Sizes.MEDIUM:
      return 18

    case Sizes.LARGE:
      return 22

    default:
      throw new Error(`Invalid form size "${size}"`)
  }
}

function getContrastColor(contrast: Contrast): string {
  switch (contrast) {
    case Contrasts.LIGHT:
      return 'rgba(0, 0, 0, 0.8)'

    case Contrasts.DARK:
      return 'rgba(255, 255, 255, 0.95)'

    default:
      throw new Error(`Invalid form contrast "${contrast}"`)
  }
}

const Base = styled.label<{
  contrast?: ResponsiveValue<Contrast> | null | undefined
  size?: ResponsiveValue<Size> | null | undefined
  textStyle?: TextStyleValue | null | undefined
  textColor?: ResponsiveValue<ColorValue> | null | undefined
}>`
  display: block;
  margin: 0 0 0.25em 0;
  ${cssTextStyle()}
  ${props =>
    cssMediaRules(
      [props.size, props.contrast, props.textColor] as const,
      ([size = Sizes.MEDIUM, contrast = Contrasts.LIGHT, textColor]) => css`
        min-height: ${getSizeHeight(size)}px;
        color: ${textColor == null ? getContrastColor(contrast) : colorToString(textColor)};
      `,
    )}
`

type Props = ComponentPropsWithoutRef<typeof Base>

export default function Label(props: Props): JSX.Element {
  const { contrast, size, labelTextStyle, labelTextColor } = useFormContext()

  return (
    <Base
      {...props}
      contrast={contrast}
      size={size}
      textStyle={labelTextStyle}
      textColor={useColor(labelTextColor)}
    />
  )
}
