import { ComponentPropsWithoutRef } from 'react'
import styled, { css } from 'styled-components'

import useTypographyMark, {
  TypographyMarkValue,
  TypographyMarkData,
  overrideTypographyStyle,
  TypographyMarkDataValue,
} from './hooks/useTypographyMark'
import { cssMediaRules } from '../../../../../../utils/cssMediaRules'
import { colorToString } from '../../../../../../utils/colorToString'
import { shallowMergeFallbacks } from '../../../../../../utils/devices'

export type { TypographyMarkValue }
export { overrideTypographyStyle }

const Span = styled.span<{ typographyStyle: TypographyMarkData | null | undefined }>`
  ${p =>
    cssMediaRules(
      [p.typographyStyle] as const,
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
      ]) => css`
        ${color == null
          ? ''
          : css`
              color: ${colorToString(color)};
            `}

        ${fontFamily == null
          ? ''
          : css`
              font-family: '${fontFamily}';
            `}

        ${fontSize == null || fontSize.value == null || fontSize.unit == null
          ? ''
          : css`
              font-size: ${`${fontSize.value}${fontSize.unit}`};
            `}

        ${fontWeight == null
          ? ''
          : css`
              font-weight: ${fontWeight};
            `}

        ${lineHeight == null
          ? ''
          : css`
              line-height: ${lineHeight};
            `}

        ${letterSpacing == null
          ? ''
          : css`
              letter-spacing: ${letterSpacing / 10}em;
            `}

        ${underline == null && strikethrough == null
          ? ''
          : css`
              text-decoration: ${[
                Boolean(underline) && 'underline',
                Boolean(strikethrough) && 'line-through',
              ]
                .filter(Boolean)
                .join(' ')};
            `}

        ${uppercase == null
          ? ''
          : css`
              text-transform: ${uppercase === true ? 'uppercase' : 'initial'};
            `}

        ${italic == null
          ? ''
          : css`
              font-style: ${italic === true ? 'italic' : 'initial'};
            `}
      `,
      shallowMergeFallbacks,
    )}
`

type BaseProps = { value: TypographyMarkValue }

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof Span>, keyof BaseProps>

export default function Mark({ value, ...restOfProps }: Props): JSX.Element {
  const typographyStyle = useTypographyMark(value)

  return <Span {...restOfProps} typographyStyle={typographyStyle} />
}
