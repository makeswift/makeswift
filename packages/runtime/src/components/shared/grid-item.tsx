import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef, ElementType } from 'react'
import { ResponsiveValue, Length as LengthValue } from '../../prop-controllers'
import { useStyle } from '../../runtimes/react/use-style'
import { responsiveGridItem } from '../utils/responsive-style'

type BaseProps<T extends ElementType> = {
  as?: T
  className?: string
  grid: ResponsiveValue<{ spans: Array<Array<number>>; count: number }>
  index: number
  columnGap?: ResponsiveValue<LengthValue>
  rowGap?: ResponsiveValue<LengthValue>
}

type Props<T extends ElementType> = BaseProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BaseProps<T>>

export function GridItem<T extends ElementType = 'div'>({
  as,
  grid,
  index,
  columnGap,
  rowGap,
  className,
  ...restOfProps
}: Props<T>) {
  const gridItemClassName = useStyle(responsiveGridItem({ grid, index, columnGap, rowGap }))
  const Component = as ?? 'div'

  return <Component {...restOfProps} className={cx(gridItemClassName, className)} />
}
