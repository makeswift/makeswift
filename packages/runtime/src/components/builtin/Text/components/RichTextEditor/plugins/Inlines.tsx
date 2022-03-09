import { Plugin } from 'slate-react'

export default function Inlines(): Plugin {
  return {
    renderInline(props, _editor, next) {
      const { attributes, children, node } = props

      switch (node.type) {
        case 'code': {
          return <code {...attributes}>{children}</code>
        }

        case 'superscript': {
          return <sup {...attributes}>{children}</sup>
        }

        case 'subscript': {
          return <sub {...attributes}>{children}</sub>
        }

        default: {
          return next()
        }
      }
    },
  }
}
