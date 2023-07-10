import { Element } from 'slate'
import { createRichTextV2Plugin } from '../../controls/rich-text-v2'
import { Link } from '../../controls/link'
import { ElementUtils } from '../utils/element'
import { isLinkElement } from './types'
import { onChange } from './onChange'
import { getValue } from './getValue'

/**
 * The default LinkPlugin uses a renderElement that references -> Link -> useElementId
 * This causes a circular dependency when referencing LinkPlugin in RichTextControl Definition.
 * So I am creating a custom plugin to work around this while circular dependency stuff is worked out.
 */
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
  })
}
