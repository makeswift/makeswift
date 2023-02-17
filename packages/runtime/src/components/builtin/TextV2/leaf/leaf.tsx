import { RenderLeafProps } from 'slate-react'
import { TextTypes } from './types'
import { TypographyLeaf, TypographyLeafProps } from './typography-leaf'

export function Leaf(props: RenderLeafProps) {
  switch (props.leaf.type) {
    case TextTypes.Typography:
      //todo
      return <TypographyLeaf {...props.attributes} {...(props as TypographyLeafProps)} />

    default:
      return <span {...props.attributes}>{props.children}</span>
  }
}
