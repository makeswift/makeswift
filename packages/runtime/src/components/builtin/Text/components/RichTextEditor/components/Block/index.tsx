import { forwardRef, ElementType, ComponentPropsWithoutRef } from 'react'
import styled, { css } from 'styled-components'

import { cssMediaRules } from '../../../../../../utils/cssMediaRules'
import type { ResponsiveValue } from '../../../../../../../prop-controllers'

type StyledBlockProps = {
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>
  as?: ElementType
}

const StyledBlock = styled.div<StyledBlockProps>`
  margin: 0;
  ${p =>
    cssMediaRules([p.textAlign] as const, ([textAlign]) =>
      textAlign == null
        ? css``
        : css`
            text-align: ${textAlign};
          `,
    )}

  ${p =>
    p.as === 'blockquote'
      ? css`
          padding: 0.5em 10px;
          font-size: 1.25em;
          font-weight: 300;
          border-left: 5px solid rgba(0, 0, 0, 0.1);
        `
      : ''}
`

type Props = ComponentPropsWithoutRef<typeof StyledBlock>

export default forwardRef<HTMLDivElement, Props>(function Block(
  { textAlign, ...restOfProps }: Props,
  ref,
) {
  return <StyledBlock {...restOfProps} ref={ref} textAlign={textAlign} />
})
