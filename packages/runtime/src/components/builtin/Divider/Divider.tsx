import { forwardRef, Ref } from 'react'

import { colorToString } from '../../utils/colorToString'
import { ResponsiveColor } from '../../../runtimes/react/controls'
import { useStyle } from '../../../runtimes/react/use-style'
import { cx } from '@emotion/css'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { type ResponsiveLengthData, type ResponsiveSelectValue } from '@makeswift/prop-controllers'

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
  return (
    // IE11 has a bug with Flexbox vertical centering with min height if height is not set.
    // Wrapping it in another flex container fixes it for some reason, read more here:
    // https://stackoverflow.com/questions/19371626/flexbox-not-centering-vertically-in-ie
    <div
      ref={ref}
      id={id}
      className={cx(useStyle({ display: 'flex', width: '100%' }), width, margin)}
    >
      <div
        className={useStyle({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 40,
          width: '100%',
        })}
      >
        <div
          className={useStyle(
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
            ),
          )}
        />
      </div>
    </div>
  )
})

export default Divider
