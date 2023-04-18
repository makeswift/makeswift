import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef } from 'react'
import { ResponsiveValue, Length } from '../../../prop-controllers/descriptors'
import { useStyle } from '../../../runtimes/react/use-style'
import { useResponsiveStyle } from '../../utils/responsive-style'

type BaseProps = {
  className?: string
  gutter?: ResponsiveValue<Length>
  first: boolean
  last: boolean
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export default function GutterContainer({ className, gutter, first, last, ...restOfProps }: Props) {
  return (
    <div
      {...restOfProps}
      className={cx(
        useStyle(
          useResponsiveStyle([gutter] as const, ([gutter = { value: 0, unit: 'px' }]) => ({
            paddingLeft: first ? '0px' : `${gutter.value / 2}${gutter.unit}`,
            paddingRight: last ? '0px' : `${gutter.value / 2}${gutter.unit}`,
          })),
        ),
        className,
      )}
    />
  )
}
