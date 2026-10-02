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

export function Link(config?: { description?: string; label?: string }): LinkDefinition {
  return new LinkDefinition(config ?? {})
}

const URL_LINK_TYPE = 'makeswift::controls::unstable-url-link'

/**
 * A Link control that allows URLs only. The data is the Link data. The builder
 * shows only the URL option for this type.
 */
export class unstable_UrlLinkDefinition extends LinkDefinition {
  // `any`: the base class types `type` as the Link literal.
  static readonly type: any = URL_LINK_TYPE

  static deserialize(data: DeserializedRecord): unstable_UrlLinkDefinition {
    if (data.type !== URL_LINK_TYPE) {
      throw new Error(`UrlLink: expected type ${URL_LINK_TYPE}, got ${data.type}`)
    }

    const { config } = LinkDefinition.schema.definition.parse({
      ...data,
      type: LinkDefinition.type,
    })
    return new unstable_UrlLinkDefinition(config)
  }

  get controlType(): any {
    return URL_LINK_TYPE
  }
}

export function unstable_UrlLink(config?: {
  description?: string
  label?: string
}): unstable_UrlLinkDefinition {
  return new unstable_UrlLinkDefinition(config ?? {})
}
