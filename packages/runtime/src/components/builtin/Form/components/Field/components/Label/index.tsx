import { ComponentPropsWithoutRef, ElementType } from 'react'
import { colorToString } from '../../../../../../utils/colorToString'

import { useFormContext, Size, Sizes, Contrast, Contrasts } from '../../../../context/FormContext'
import { cx } from '@emotion/css'
import { useStyle } from '../../../../../../../runtimes/react/use-style'
import {
  useResponsiveStyle,
  useResponsiveTextStyle,
} from '../../../../../../utils/responsive-style'

export function getSizeHeight(size: Size): number {
  switch (size) {
    case Sizes.SMALL:
      return 14

    case Sizes.MEDIUM:
      return 18

    case Sizes.LARGE:
      return 22

    default:
      throw new Error(`Invalid form size "${size}"`)
  }
}

function getContrastColor(contrast: Contrast): string {
  switch (contrast) {
    case Contrasts.LIGHT:
      return 'rgba(0, 0, 0, 0.8)'

    case Contrasts.DARK:
      return 'rgba(255, 255, 255, 0.95)'

    default:
      throw new Error(`Invalid form contrast "${contrast}"`)
  }
}

type BaseProps<T extends ElementType> = {
  as?: T
}

type Props<T extends ElementType> = BaseProps<T> &
  Omit<ComponentPropsWithoutRef<'label'>, keyof BaseProps<T>>

export default function Label<T extends ElementType = 'label'>({
  as,
  className,
  ...restOfProps
}: Props<T>): JSX.Element {
  const Component = as ?? 'label'
  const { contrast, size, labelTextStyle, labelTextColor } = useFormContext()

  return (
    <Component
      {...restOfProps}
      className={cx(
        useStyle({ display: 'block', margin: '0 0 0.25em 0' }),
        useStyle(useResponsiveTextStyle(labelTextStyle)),
        useStyle(
          useResponsiveStyle(
            [size, contrast, labelTextColor] as const,
            ([size = Sizes.MEDIUM, contrast = Contrasts.LIGHT, textColor]) => ({
              minHeight: getSizeHeight(size),
              color: textColor == null ? getContrastColor(contrast) : colorToString(textColor),
            }),
          ),
        ),
        className,
      )}
    />
  )
}
