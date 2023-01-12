import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef } from 'react'
import {
  ResponsiveValue,
  Length as LengthValue,
  ResponsiveNumberValue,
} from '../../prop-controllers'
import { useStyle } from '../../runtimes/react/use-style'
import { useItemAnimation } from '../builtin/Box/animations'
import { responsiveGridItem } from '../utils/responsive-style'

type BaseProps = {
  className?: string
  grid: ResponsiveValue<{ spans: Array<Array<number>>; count: number }>
  index: number
  columnGap?: ResponsiveValue<LengthValue>
  rowGap?: ResponsiveValue<LengthValue>
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
  const gridItemClassName = useStyle(responsiveGridItem({ grid, index, columnGap, rowGap }))
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
