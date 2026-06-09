import { ComponentPropsWithoutRef } from 'react'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { LengthData, ResponsiveValue } from '@makeswift/prop-controllers'
import { useStyle } from '../../../runtimes/react/css-runtime/hooks/use-style'
import clsx from 'clsx'

type BaseProps = {
  className?: string
  gutter?: ResponsiveValue<LengthData>
  first: boolean
  last: boolean
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export default function GutterContainer({ className, gutter, first, last, ...restOfProps }: Props) {
  const { className: baseClassName, styleElement: baseStyleElement } = useStyle(useResponsiveStyle([gutter] as const, ([gutter = { value: 0, unit: 'px' }]) => ({
    paddingLeft: first ? '0px' : `${gutter.value / 2}${gutter.unit}`,
    paddingRight: last ? '0px' : `${gutter.value / 2}${gutter.unit}`,
  })))
  return (
    <>
      {baseStyleElement}
      <div
        {...restOfProps}
        className={clsx(
          baseClassName,
          className,
        )}
      />
    </>
  )
}
