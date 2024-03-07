import { MouseEvent, useCallback, useMemo } from 'react'

import scrollIntoView from 'scroll-into-view-if-needed'
import { useElementId } from '../'
import { LinkControlData, LinkControlDefinition } from '../../../controls'
import { usePagePathnameSlice } from '../hooks/makeswift-api'

type LinkValue = {
  href: string
  target: '_blank' | '_self' | undefined
  onClick: (event: MouseEvent<HTMLElement>) => void
}

export type LinkControlValue<_T extends LinkControlDefinition> = LinkValue | undefined

export function useLinkControlValue<T extends LinkControlDefinition>(
  link: LinkControlData | undefined,
  _definition: T,
): LinkControlValue<T> {
  const pageId = link && link.type === 'OPEN_PAGE' ? link.payload.pageId : null
  const page = usePagePathnameSlice(pageId ?? null)

  const elementKey =
    link?.type === 'SCROLL_TO_ELEMENT' ? link.payload.elementIdConfig?.elementKey : null
  const elementId = useElementId(elementKey)

  let href = '#'
  let target: '_blank' | '_self' | undefined
  let block: 'start' | 'center' | 'end' | undefined

  if (link) {
    switch (link.type) {
      case 'OPEN_PAGE': {
        if (page) href = `/${page.localizedPathname ?? page.pathname}`

        target = link.payload.openInNewTab ? '_blank' : '_self'

        break
      }

      case 'OPEN_URL': {
        href = link.payload.url

        target = link.payload.openInNewTab ? '_blank' : '_self'

        break
      }

      case 'SEND_EMAIL': {
        const { to, subject = '', body = '' } = link.payload

        if (to != null) href = `mailto:${to}?subject=${subject}&body=${body}`

        break
      }

      case 'CALL_PHONE': {
        href = `tel:${link.payload.phoneNumber}`

        break
      }

      case 'SCROLL_TO_ELEMENT': {
        href = `#${elementId ?? ''}`
        block = link.payload.block

        break
      }

      default:
        throw new RangeError(`Invalid link type "${(link as any).type}."`)
    }
  }

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented) return

      if (link && link.type === 'SCROLL_TO_ELEMENT') {
        let hash: string | undefined

        try {
          hash = new URL(`http://www.example.com/${href}`).hash
        } catch (error) {
          console.error(`Link received invalid href: ${href}`, error)
        }

        if (href != null && href === hash) {
          event.preventDefault()
          const view = event.view as unknown as Window

          scrollIntoView(view.document.querySelector(hash)!, {
            behavior: 'smooth',
            block,
          })

          if (view.location.hash !== hash) view.history.pushState({}, '', hash)
        }
      }
    },
    [link, href, block],
  )

  const res = useMemo(() => ({ href, target, onClick: handleClick }), [href, target, handleClick])

  return res
}
