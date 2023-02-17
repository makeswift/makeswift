import { RenderLeafProps } from 'slate-react'
import { ResponsiveValue } from '../../../../prop-controllers'
import { useStyle } from '../../../../runtimes/react/use-style'
import { colorToString } from '../../../utils/colorToString'
import { shallowMergeFallbacks } from '../../../utils/devices'
import { responsiveStyle } from '../../../utils/responsive-style'
import useTypographyMark, {
  TypographyMarkDataValue,
} from '../../Text/components/RichTextEditor/components/Mark/hooks/useTypographyMark'
import { TypographyText } from './types'

export interface TypographyLeafProps extends RenderLeafProps {
  leaf: TypographyText
}

export function TypographyLeaf(props: TypographyLeafProps) {
  const typographyStyle = useTypographyMark(props.leaf.typography)
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

  return (
    <span {...props} className={typographyClassName}>
      {props.children}
    </span>
  )
}
