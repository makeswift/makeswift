import { z } from 'zod'
import { type MouseEvent } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'

import {
  type DeserializedRecord,
  LinkDefinition as BaseLinkDefinition,
  LinkSchema,
} from '@makeswift/controls'

type DataType = z.infer<typeof LinkDefinition.schema.data>
type ScrollOptions = z.infer<typeof LinkSchema.scrollOptions>
type MouseEventType = MouseEvent<Element>

export function validateElementRef(href: string) {
  try {
    const hash = new URL(`http://www.example.com/${href}`).hash
    return href === hash ? hash : undefined
  } catch (error) {
    return undefined
  }
}

export class LinkDefinition extends BaseLinkDefinition<MouseEventType> {
  static deserialize(data: DeserializedRecord): LinkDefinition {
    if (data.type !== LinkDefinition.type) {
      throw new Error(`Link: expected type ${LinkDefinition.type}, got ${data.type}`)
    }

    const { config } = LinkDefinition.schema.definition.parse(data)
    return Link(config)
  }

  resolveOnClick(
    data: DataType | undefined,
    href: string,
    scrollOptions: ScrollOptions | undefined,
  ) {
    const onClick = (event: MouseEvent<Element>) => {
      if (event.defaultPrevented) return

      if (data && data.type === 'SCROLL_TO_ELEMENT') {
        const hash = validateElementRef(href)
        if (hash == null) {
          console.error(`Scroll-to-element link received invalid href: ${href}`)
          return
        }

        event.preventDefault()
        const view = event.view as unknown as Window

        scrollIntoView(view.document.querySelector(hash)!, {
          behavior: 'smooth',
          block: scrollOptions?.block,
        })

        if (view.location.hash !== hash) view.history.pushState({}, '', hash)
      }
    }

    onClick.$scrollOptions = scrollOptions
    return onClick
  }
}

export function Link(config?: { description?: string, label?: string }): LinkDefinition {
  return new LinkDefinition(config ?? {})
}
