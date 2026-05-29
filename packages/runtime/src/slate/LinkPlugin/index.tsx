import { type Editor, Element } from 'slate'
import { type RenderElementProps } from 'slate-react'
import { Slate } from '@makeswift/controls'

import { Link } from '../../controls/link'
import { Link as LinkComponent } from '../../components/shared/Link'
import { type RenderElement, Plugin } from '../../controls/rich-text-v2/plugin'

import { onChange } from './onChange'
import { getValue } from './getValue'
import { useStyle } from '../../runtimes/react/css-runtime/hooks/use-style'
import clsx from 'clsx'

export const withLink = (editor: Editor) => {
  const { isInline } = editor

  editor.isInline = entry => {
    return Slate.isInline(entry) && isInline(entry)
  }

  return editor
}

function InlinePluginComponent({
  element,
  attributes,
  children,
  renderElement,
}: RenderElementProps & { renderElement: RenderElement }) {
  const { className: linkClassName, styleElement: linkStyleElement } = useStyle({ textDecoration: 'none' })
  switch (element.type) {
    case Slate.InlineType.Link:
      return (
        <>
          {linkStyleElement}
          <LinkComponent
            {...attributes}
            link={element.link ?? undefined}
            className={clsx(linkClassName, element.className)}
          >
            {renderElement({
              element,
              attributes,
              children,
            })}
          </LinkComponent>
        </>
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
  return Plugin({
    control: {
      definition: Link({
        label: 'On Click',
      }),
      onChange,
      getValue,
      getElementValue: (element: Element) => {
        return Slate.isLink(element) ? element.link : undefined
      },
    },
    withPlugin: withLink,
    renderElement: renderElement => props => {
      return <InlinePluginComponent {...props} renderElement={renderElement} />
    },
  })
}
