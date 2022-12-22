import { ComponentPropsWithoutRef } from 'react'

import useTypographyMark, {
  TypographyMarkValue,
  overrideTypographyStyle,
  TypographyMarkDataValue,
} from './hooks/useTypographyMark'
import { colorToString } from '../../../../../../utils/colorToString'
import { shallowMergeFallbacks } from '../../../../../../utils/devices'
import { cx } from '@emotion/css'
import { useStyle } from '../../../../../../../runtimes/react/use-style'
import { responsiveStyle } from '../../../../../../utils/responsive-style'
import { ResponsiveValue } from '../../../../../../../prop-controllers/descriptors'

export type { TypographyMarkValue }
export { overrideTypographyStyle }

type BaseProps = { value: TypographyMarkValue }

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'span'>, keyof BaseProps>

export default function Mark({ value, className, ...restOfProps }: Props): JSX.Element {
  const typographyStyle = useTypographyMark(value)
  const typographyClassName = useStyle(
    responsiveStyle<
      TypographyMarkDataValue,
      [ResponsiveValue<TypographyMarkDataValue> | null | undefined]
    >(
      [typographyStyle],
      ([
        {
          color,
          fontFamily,
          fontSize,
          fontWeight,
          lineHeight,
          letterSpacing,
          uppercase,
          underline,
          strikethrough,
          italic,
        } = {} as TypographyMarkDataValue,
      ]) => ({
        ...(color == null ? {} : { color: colorToString(color) }),
        ...(fontFamily == null ? {} : { fontFamily }),
        ...(fontSize == null || fontSize.value == null || fontSize.unit == null
          ? {}
          : { fontSize: `${fontSize.value}${fontSize.unit}` }),
        ...(fontWeight == null ? {} : { fontWeight }),
        ...(lineHeight == null ? {} : { lineHeight }),
        ...(letterSpacing == null ? {} : { letterSpacing: `${letterSpacing / 10}em` }),
        ...(uppercase == null
          ? {}
          : { textTransform: uppercase === true ? 'uppercase' : 'initial' }),
        ...(underline == null && strikethrough == null
          ? {}
          : {
              textDecoration: [
                Boolean(underline) && 'underline',
                Boolean(strikethrough) && 'line-through',
              ]
                .filter(Boolean)
                .join(' '),
            }),
        ...(italic == null ? {} : { fontStyle: italic === true ? 'italic' : 'initial' }),
      }),
      shallowMergeFallbacks,
    ),
  )

  return <span {...restOfProps} className={cx(typographyClassName, className)} />
}
