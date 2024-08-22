import { type Editor, type Element } from 'slate'
import { type RenderElementProps } from 'slate-react'
import { unstable_IconRadioGroup, Slate } from '@makeswift/controls'

import { type RenderElement, Plugin } from '../../controls/rich-text-v2/plugin'

import { supportedInlineOptions, isSupportedInlineNode } from './types'
import { onChange } from './onChange'
import { getValue } from './getValue'

export const withInline = (editor: Editor) => {
  const { isInline } = editor

  editor.isInline = entry => {
    return Slate.isInline(entry) && isInline(entry)
  }

  return editor
}

export function InlinePlugin() {
  return Plugin({
    control: {
      definition: unstable_IconRadioGroup({
        label: 'Inline',
        options: supportedInlineOptions,
      }),
      onChange,
      getValue,
      getElementValue: (element: Element) =>
        isSupportedInlineNode(element) ? element.type : undefined,
    },
    withPlugin: withInline,
    renderElement: renderElement => props => {
      return <InlinePluginComponent {...props} renderElement={renderElement} />
    },
  })
}

function InlinePluginComponent({
  renderElement,
  ...props
}: RenderElementProps & { renderElement: RenderElement }) {
  switch (props.element.type) {
    case Slate.InlineType.Code:
      return <code {...props.attributes}>{renderElement(props)}</code>

    case Slate.InlineType.SuperScript:
      return <sup {...props.attributes}>{renderElement(props)}</sup>

    case Slate.InlineType.SubScript:
      return <sub {...props.attributes}>{renderElement(props)}</sub>

    default:
      return <>{renderElement(props)}</>
  }
}
