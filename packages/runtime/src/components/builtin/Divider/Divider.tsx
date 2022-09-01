import { forwardRef, Ref } from 'react'
import styled, { css } from 'styled-components'

import { cssMediaRules, cssMargin, cssWidth } from '../../utils/cssMediaRules'
import {
  ResponsiveValue,
  ElementIDValue,
  MarginValue,
  ResponsiveLengthValue,
  ResponsiveSelectValue,
  WidthValue,
} from '../../../prop-controllers/descriptors'
import { colorToString } from '../../utils/colorToString'
import { ColorValue as Color } from '../../utils/types'
import { ResponsiveColor } from '../../../runtimes/react/controls'

type DividerVariant = 'solid' | 'dashed' | 'dotted' | 'blended'

type Props = {
  id?: ElementIDValue
  variant?: ResponsiveSelectValue<DividerVariant>
  thickness?: ResponsiveLengthValue
  color?: ResponsiveColor | null
  width?: WidthValue
  margin?: MarginValue
}

// IE11 has a bug with Flexbox vertical centering with min height if height is not set.
// Wrapping it in another flex container fixes it for some reason, read more here:
// https://stackoverflow.com/questions/19371626/flexbox-not-centering-vertically-in-ie
const IE11MinHeightContainer = styled.div.withConfig({
  shouldForwardProp: prop => !['width', 'margin'].includes(prop),
})<{ width: Props['width']; margin: Props['margin'] }>`
  display: flex;
  width: 100%;
  ${cssWidth()}
  ${cssMargin()}
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 40px;
  width: 100%;
`

const Line = styled.div.withConfig({
  shouldForwardProp: prop => !['variant', 'color', 'thickness'].includes(prop),
})<{
  variant: Props['variant']
  color?: ResponsiveValue<Color> | null
  thickness: Props['thickness']
}>`
  ${p =>
    cssMediaRules(
      [p.variant, p.thickness, p.color] as const,
      ([
        variant = 'solid',
        thickness = { value: 1, unit: 'px' },
        color = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 },
      ]) => {
        switch (variant) {
          case 'solid':
          case 'dashed':
          case 'dotted':
            return css`
              border-bottom-width: ${thickness == null
                ? '1px'
                : `${thickness.value}${thickness.unit}`};
              border-bottom-style: ${variant};
              border-bottom-color: ${colorToString(color)};
            `

          case 'blended':
            return css`
              height: ${`${thickness.value}${thickness.unit}`};
              background: linear-gradient(
                ${[
                  '90deg',
                  colorToString({ swatch: color.swatch, alpha: 0 }),
                  colorToString(color),
                  colorToString({ swatch: color.swatch, alpha: 0 }),
                ].join(', ')}
              );
            `

          default:
            variant as never
            throw new Error(`Invalid variant ${variant}.`)
        }
      },
    )}
`

const Divider = forwardRef(function Divider(
  { id, variant, thickness, color, width, margin }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <IE11MinHeightContainer ref={ref} id={id} width={width} margin={margin}>
      <Container>
        {/* @ts-expect-error: HTMLDivElement `color` attribute conflicts with prop */}
        <Line variant={variant} thickness={thickness} color={color} />
      </Container>
    </IE11MinHeightContainer>
  )
})

export default Divider
