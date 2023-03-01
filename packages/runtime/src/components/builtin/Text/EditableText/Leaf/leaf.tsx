import { RenderLeafProps } from 'slate-react'
import { TextType } from '../../../../../controls'
import { TypographyLeaf } from './typography'

export function Leaf({ leaf, attributes, children }: RenderLeafProps) {
  switch (leaf.type) {
    case TextType.Typography:
      return (
        <TypographyLeaf {...attributes} typography={leaf.typography}>
          {children}
        </TypographyLeaf>
      )

    default:
      return <span {...attributes}>{children}</span>
  }
}
