import { ComponentPropsWithoutRef } from 'react'
import { type ResponsiveValue } from '@makeswift/controls'
import { useItemAnimation } from '../builtin/Box/animations'
import { useResponsiveGridItem } from '../utils/responsive-style'
import { type LengthData, type ResponsiveNumberValue } from '@makeswift/prop-controllers'
import { useStyle } from '../../runtimes/react/css-runtime/hooks/use-style'
import clsx from 'clsx'

type BaseProps = {
  className?: string
  grid: ResponsiveValue<{ spans: Array<Array<number>>; count: number }>
  index: number
  columnGap?: ResponsiveValue<LengthData>
  rowGap?: ResponsiveValue<LengthData>
  itemAnimateDuration?: ResponsiveNumberValue
  itemAnimateDelay?: ResponsiveNumberValue
  itemStaggerDuration?: ResponsiveNumberValue
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export const gridItemIdentifierClassName = 'grid-item'

export function GridItem({
  grid,
  index,
  columnGap,
  rowGap,
  className,
  itemAnimateDuration,
  itemAnimateDelay,
  itemStaggerDuration,
  ...restOfProps
}: Props) {
  const { className: baseClassName, styleElement: baseStyleElement } = useStyle(useResponsiveGridItem({ grid, index, columnGap, rowGap }))
  const [animationClassName, animationStyle] = useItemAnimation(
    itemAnimateDuration,
    itemAnimateDelay,
    itemStaggerDuration,
    index,
  )

  return (
    <>
      {baseStyleElement}
      {animationStyle}
      <div
        {...restOfProps}
        className={clsx(baseClassName, className, animationClassName, gridItemIdentifierClassName)}
      />
    </>
  )
}
