import { RenderLeafProps, useFocused } from 'slate-react'
import { TextType } from '../../../../../controls'
import { TypographyLeaf } from './typography'

export function Leaf({ leaf, ...props }: RenderLeafProps) {
  switch (leaf.type) {
    case TextType.Typography:
      return <TypographyLeaf leaf={leaf} {...props} />

    default:
      return (
        <span {...props.attributes} style={leaf.selected ? { background: 'rgba(0,0,0,.1)' } : {}}>
          {props.children}
        </span>
      )
  }
}
