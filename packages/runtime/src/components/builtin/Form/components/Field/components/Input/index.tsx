import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react'
import { useStyle } from '../../../../../../../runtimes/react/use-style'

import { responsiveStyle } from '../../../../../../utils/responsive-style'
import { Size, useFormContext, Sizes } from '../../../../context/FormContext'
import responsiveField from '../../services/responsiveField'

export function getSizeHeight(size: Size): number {
  switch (size) {
    case Sizes.SMALL:
      return 36

    case Sizes.MEDIUM:
      return 42

    case Sizes.LARGE:
      return 48

    default:
      throw new Error(`Invalid form size "${size}"`)
  }
}

type BaseProps = { error?: boolean; form?: unknown }

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'input'>, keyof BaseProps>

export default forwardRef(function Input(
  { error = false, form, className, ...restOfProps }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { shape, size, contrast, brandColor } = useFormContext()

  return (
    <input
      {...restOfProps}
      ref={ref}
      className={cx(
        className,
        useStyle(responsiveField({ shape, size, contrast, brandColor, error })),
        useStyle(
          responsiveStyle([size] as const, ([size = Sizes.MEDIUM]) => ({
            minHeight: getSizeHeight(size),
            maxHeight: getSizeHeight(size),
          })),
        ),
      )}
    />
  )
})
