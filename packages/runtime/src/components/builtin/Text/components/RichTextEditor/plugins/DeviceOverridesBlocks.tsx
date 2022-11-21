import { Plugin } from 'slate-react'

export default function DeviceOverridesBlockPlugin(): Plugin {
  return {
    renderBlock(props, _editor, next): JSX.Element {
      const { node, attributes, children } = props
      const blockProps = { textAlign: node.data.get('textAlign') }

      switch (node.type) {
        case 'paragraph':
          return (
            <p {...attributes} {...blockProps}>
              {children}
            </p>
          )

        case 'heading-one':
          return (
            <h1 {...attributes} {...blockProps}>
              {children}
            </h1>
          )

        case 'heading-two':
          return (
            <h2 {...attributes} {...blockProps}>
              {children}
            </h2>
          )

        case 'heading-three':
          return (
            <h3 {...attributes} {...blockProps}>
              {children}
            </h3>
          )

        case 'heading-four':
          return (
            <h4 {...attributes} {...blockProps}>
              {children}
            </h4>
          )

        case 'heading-five':
          return (
            <h5 {...attributes} {...blockProps}>
              {children}
            </h5>
          )

        case 'heading-six':
          return (
            <h6 {...attributes} {...blockProps}>
              {children}
            </h6>
          )

        case 'blockquote':
          return (
            <blockquote {...attributes} {...blockProps}>
              {children}
            </blockquote>
          )

        default:
          return next()
      }
    },
  }
}
