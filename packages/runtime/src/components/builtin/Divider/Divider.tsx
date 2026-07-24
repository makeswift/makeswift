import { forwardRef, Ref } from 'react'

import { colorToString } from '../../utils/colorToString'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { type ResponsiveColor } from '../../utils/types'
import { type ResponsiveLengthData, type ResponsiveSelectValue } from '@makeswift/prop-controllers'
import { composeStyles, useStyle } from '../../../runtimes/react/css-runtime/hooks/use-style'

type DividerVariant = 'solid' | 'dashed' | 'dotted' | 'blended'

type Props = {
  id?: string
  variant?: ResponsiveSelectValue<DividerVariant>
  thickness?: ResponsiveLengthData
  color?: ResponsiveColor | null
  width?: string
  margin?: string
}

const Divider = forwardRef(function Divider(
  { id, variant, thickness, color, width, margin }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const outerDivStyles = composeStyles(
    useStyle({ display: 'flex', width: '100%' }),
    width,
    margin
  )
  const flexColumnDivStyle = useStyle({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 40,
    width: '100%',
  })
  const responsiveBorderStyle = useStyle(
    useResponsiveStyle(
      [variant, thickness, color] as const,
      ([
        variant = 'solid',
        thickness = { value: 1, unit: 'px' },
        color = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 },
      ]) => {
        switch (variant) {
          case 'solid':
          case 'dashed':
          case 'dotted':
            return {
              borderBottomWidth:
                thickness == null ? 1 : `${thickness.value}${thickness.unit}`,
              borderBottomStyle: variant,
              borderBottomColor: colorToString(color),
            }

          case 'blended':
            return {
              height: `${thickness.value}${thickness.unit}`,
              background: `linear-gradient(${[
                '90deg',
                colorToString({ swatch: color.swatch, alpha: 0 }),
                colorToString(color),
                colorToString({ swatch: color.swatch, alpha: 0 }),
              ].join(', ')})`,
            }

          default:
            variant as never
            throw new Error(`Invalid variant ${variant}.`)
        }
      },
    )
  )
  return (
    // IE11 has a bug with Flexbox vertical centering with min height if height is not set.
    // Wrapping it in another flex container fixes it for some reason, read more here:
    // https://stackoverflow.com/questions/19371626/flexbox-not-centering-vertically-in-ie
    <>
      {outerDivStyles.styleElements}
      <div
        ref={ref}
        id={id}
        className={outerDivStyles.className}
      >
        {flexColumnDivStyle.styleElement}
        <div
          className={flexColumnDivStyle.className}
        >
          {responsiveBorderStyle.styleElement}
          <div
            className={responsiveBorderStyle.className}
          />
        </div>
      </div>
    </>
  )
})

export default Divider
