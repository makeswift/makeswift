import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef } from 'react'
import { useStyle } from '../../../runtimes/react/use-style'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { LengthData, ResponsiveValue } from '@makeswift/prop-controllers'

type BaseProps = {
  className?: string
  gutter?: ResponsiveValue<LengthData>
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
