// import { Plugin } from '../../../../../../old-slate-react-types'

export default function Inlines(): any /* Plugin  */ {
  return {
    renderInline(
      props: { attributes: any; children: any; node: any },
      _editor: any,
      next: () => any,
    ) {
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
