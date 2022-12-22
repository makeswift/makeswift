import { cx } from '@emotion/css'
import { forwardRef, ComponentPropsWithoutRef, ForwardedRef, ElementRef, ElementType } from 'react'

import type { ResponsiveValue } from '../../../../../../../prop-controllers'
import { useStyle } from '../../../../../../../runtimes/react/use-style'
import { responsiveStyle } from '../../../../../../utils/responsive-style'

type BaseProps<T extends ElementType> = {
  as?: T
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>
}

type Props<T extends ElementType> = BaseProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BaseProps<T>>

export default forwardRef(function Block<T extends ElementType>(
  { textAlign, className, as, ...restOfProps }: Props<T>,
  ref: ForwardedRef<ElementRef<T>>,
) {
  const Component = as ?? 'div'

  return (
    // @ts-ignore: `ref` types don't match.
    <Component
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({ margin: 0 }),
        useStyle(responsiveStyle([textAlign], ([textAlign = 'left']) => ({ textAlign }))),
        useStyle(
          as === 'blockquote'
            ? {
                padding: '0.5em 10px',
                fontSize: '1.25em',
                fontWeight: '300',
                borderLeft: '5px solid rgba(0, 0, 0, 0.1)',
              }
            : {},
        ),
        className,
      )}
    />
  )
})
