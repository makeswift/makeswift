import { Editor, Element } from 'slate'
import { Link } from '@makeswift/controls'
import { RenderElement, createRichTextV2Plugin } from '../../controls/rich-text-v2/plugin'
import { ElementUtils } from '../utils/element'
import { InlineType } from '../types'
import { RenderElementProps } from 'slate-react'
import { useStyle } from '../../runtimes/react/use-style'
import { Link as LinkComponent } from '../../components/shared/Link'
import { cx } from '@emotion/css'
import { isLinkElement } from './types'
import { onChange } from './onChange'
import { getValue } from './getValue'

export const withLink = (editor: Editor) => {
  const { isInline } = editor

  editor.isInline = entry => {
    return ElementUtils.isInline(entry) && isInline(entry)
  }

  return editor
}

function InlinePluginComponent({
  element,
  attributes,
  children,
  renderElement,
}: RenderElementProps & { renderElement: RenderElement }) {
  const linkStyle = useStyle({ textDecoration: 'none' })
  switch (element.type) {
    case InlineType.Link:
      return (
        <LinkComponent
          {...attributes}
          link={element.link ?? undefined}
          className={cx(linkStyle, element.className)}
        >
          {renderElement({
            element,
            attributes,
            children,
          })}
        </LinkComponent>
      )

    default:
      return (
        <>
          {renderElement({
            element,
            attributes,
            children,
          })}
        </>
      )
  }
}

export function LinkPlugin() {
  return createRichTextV2Plugin({
    control: {
      definition: Link({
        label: 'On Click',
      }),
      onChange,
      getValue,
      getElementValue: (element: Element) => {
        return ElementUtils.isInline(element) && isLinkElement(element) ? element.link : undefined
      },
    },
    withPlugin: withLink,
    renderElement: renderElement => props => {
      return <InlinePluginComponent {...props} renderElement={renderElement} />
    },
  })
}
