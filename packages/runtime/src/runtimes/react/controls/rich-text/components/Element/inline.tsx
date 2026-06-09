import { ComponentPropsWithoutRef } from 'react'
import { RenderElementProps } from 'slate-react'
import { Slate } from '@makeswift/controls'

import { Link } from '../../../../../../components/shared/Link'
import { InlineType } from '../../../../../../slate/types'
import { useStyle } from '../../../../css-runtime/hooks/use-style'
import clsx from 'clsx'

function StyledLink({ className, ...restOfProps }: ComponentPropsWithoutRef<typeof Link>) {
  const { className: baseClassName, styleElement } = useStyle({ textDecoration: 'none' })
  return (
    <>
      {styleElement}
      <Link {...restOfProps} className={clsx(baseClassName, className)} />
    </>
  )
}

export interface InlineRenderElementProps extends RenderElementProps {
  element: Slate.Inline
}

export function InlineElement({ element, attributes, children }: InlineRenderElementProps) {
  switch (element.type) {
    case InlineType.Code:
      return <code {...attributes}>{children}</code>

    case InlineType.SuperScript:
      return <sup {...attributes}>{children}</sup>

    case InlineType.SubScript:
      return <sub {...attributes}>{children}</sub>

    case InlineType.Link:
      return (
        <StyledLink {...attributes} link={element.link ?? undefined}>
          {children}
        </StyledLink>
      )
  }
}
