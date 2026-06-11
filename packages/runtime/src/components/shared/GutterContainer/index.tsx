import { ComponentPropsWithoutRef } from 'react'
import { useResponsiveStyle } from '../../utils/responsive-style'
import { LengthData, ResponsiveValue } from '@makeswift/prop-controllers'
import { composeStyles, useStyle } from '../../../runtimes/react/css-runtime/hooks/use-style'

type BaseProps = {
  className?: string
  gutter?: ResponsiveValue<LengthData>
  first: boolean
  last: boolean
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export default function GutterContainer({ className, gutter, first, last, ...restOfProps }: Props) {
  const styles = composeStyles(
    useStyle(useResponsiveStyle([gutter] as const, ([gutter = { value: 0, unit: 'px' }]) => ({
      paddingLeft: first ? '0px' : `${gutter.value / 2}${gutter.unit}`,
      paddingRight: last ? '0px' : `${gutter.value / 2}${gutter.unit}`,
    }))),
    className
  )
  return (
    <>
      {styles.styleElements}
      <div
        {...restOfProps}
        className={styles.className}
      />
    </>
  )
}
