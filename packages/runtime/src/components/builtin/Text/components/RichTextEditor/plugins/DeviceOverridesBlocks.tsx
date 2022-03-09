import { Plugin } from 'slate-react'

import Block from '../components/Block'

export default function DeviceOverridesBlockPlugin(): Plugin {
  return {
    renderBlock(props, _editor, next): JSX.Element {
      const { node, attributes, children } = props
      const blockProps = { textAlign: node.data.get('textAlign') }

      switch (node.type) {
        case 'paragraph':
          return (
            <Block {...attributes} {...blockProps} as="p">
              {children}
            </Block>
          )

        case 'heading-one':
          return (
            <Block {...attributes} {...blockProps} as="h1">
              {children}
            </Block>
          )

        case 'heading-two':
          return (
            <Block {...attributes} {...blockProps} as="h2">
              {children}
            </Block>
          )

        case 'heading-three':
          return (
            <Block {...attributes} {...blockProps} as="h3">
              {children}
            </Block>
          )

        case 'heading-four':
          return (
            <Block {...attributes} {...blockProps} as="h4">
              {children}
            </Block>
          )

        case 'heading-five':
          return (
            <Block {...attributes} {...blockProps} as="h5">
              {children}
            </Block>
          )

        case 'heading-six':
          return (
            <Block {...attributes} {...blockProps} as="h6">
              {children}
            </Block>
          )

        case 'blockquote':
          return (
            <Block {...attributes} {...blockProps} as="blockquote">
              {children}
            </Block>
          )

        default:
          return next()
      }
    },
  }
}
