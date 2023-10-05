import { Editor, Element } from 'slate'
import { unstable_IconRadioGroup } from '../../controls'
import { ElementUtils } from '../utils/element'
import { InlineType } from '../types'
import { RenderElementProps } from 'slate-react'
import { supportedInlineOptions } from './types'
import { onChange } from './onChange'
import { getValue } from './getValue'
import { RenderElement, createRichTextV2Plugin } from '../../controls/rich-text-v2/plugin'

export const withInline = (editor: Editor) => {
  const { isInline } = editor

  editor.isInline = entry => {
    return ElementUtils.isInline(entry) && isInline(entry)
  }

  return editor
}

export function InlinePlugin() {
  return createRichTextV2Plugin({
    control: {
      definition: unstable_IconRadioGroup({
        label: 'Inline',
        options: supportedInlineOptions,
      }),
      onChange,
      getValue,
      getElementValue: (element: Element) => {
        return ElementUtils.isInline(element) ? element.type : undefined
      },
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
    case InlineType.Code:
      return (
        <code className={props.element.className ?? ''} {...props.attributes}>
          {renderElement(props)}
        </code>
      )
    case InlineType.SuperScript:
      return (
        <sup className={props.element.className ?? ''} {...props.attributes}>
          {renderElement(props)}
        </sup>
      )
    case InlineType.SubScript:
      return (
        <sub className={props.element.className ?? ''} {...props.attributes}>
          {renderElement(props)}
        </sub>
      )

    default:
      return <>{renderElement(props)}</>
  }
}
