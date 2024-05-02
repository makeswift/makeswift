import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef } from 'react'
import { ResponsiveValue } from '../../prop-controllers'
import { useStyle } from '../../runtimes/react/use-style'
import { useItemAnimation } from '../builtin/Box/animations'
import { useResponsiveGridItem } from '../utils/responsive-style'
import { type LengthData, type ResponsiveNumberValue } from '@makeswift/prop-controllers'

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
  const gridItemClassName = useStyle(useResponsiveGridItem({ grid, index, columnGap, rowGap }))
  const animationClassName = useItemAnimation(
    itemAnimateDuration,
    itemAnimateDelay,
    itemStaggerDuration,
    index,
  )

  return (
    <div
      {...restOfProps}
      className={cx(gridItemClassName, className, animationClassName, gridItemIdentifierClassName)}
    />
  )
}
