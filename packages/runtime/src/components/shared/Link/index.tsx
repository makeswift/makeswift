import { ComponentPropsWithoutRef, forwardRef, MouseEvent } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import NextLink from 'next/link'

import { LinkData } from '@makeswift/prop-controllers'
import { useElementId } from '../../../runtimes/react/hooks/use-element-id'
import { usePagePathnameSlice } from '../../../runtimes/react/hooks/makeswift-api'

type BaseProps = {
  link?: LinkData
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => unknown
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'a'>, keyof BaseProps>

// workaround for https://github.com/vercel/next.js/issues/66650
const isValidHref = (href: string) => {
  try {
    const bases = ['http://n', 'https://n']
    // - if `href` is a relative path, it will be resolved relative to the base URL
    // - if `href` is a full URL, the base URL will be ignored, even if there is a mismatch of protocols
    // - if `href` is an incomplete, protocol-only URL with a protocol that
    //   conflicts with one of the base URL, this will throw
    bases.forEach(base => new URL(href, base))
  } catch (_) {
    return false
  }
  return true
}

export const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  { link, onClick = () => {}, ...restOfProps }: Props,
  ref,
) {
  const pageId = link && link.type === 'OPEN_PAGE' ? link.payload.pageId : null
  const page = usePagePathnameSlice(pageId ?? null)
  const hasLocalizedPathname = page?.localizedPathname != null

  const elementKey =
    link?.type === 'SCROLL_TO_ELEMENT' ? link.payload.elementIdConfig?.elementKey : null
  const elementId = useElementId(elementKey)

  // We don't want to use `next/link` with relative paths because Next.js will attempt to normalize
  // it and mess up the path.
  let useNextLink: boolean | undefined
  let href: string | undefined
  let target: '_blank' | '_self' | undefined
  let block: 'start' | 'center' | 'end' | undefined

  if (link) {
    switch (link.type) {
      case 'OPEN_PAGE': {
        if (page) {
          useNextLink = true

          href = `/${page.localizedPathname ?? page.pathname}`
        }

        target = link.payload.openInNewTab ? '_blank' : '_self'

        break
      }

      case 'OPEN_URL': {
        useNextLink = isValidHref(link.payload.url)

        href = link.payload.url

        target = link.payload.openInNewTab ? '_blank' : '_self'

        break
      }

      case 'SEND_EMAIL': {
        useNextLink = false

        const { to, subject = '', body = '' } = link.payload

        if (to != null) href = `mailto:${to}?subject=${subject}&body=${body}`

        break
      }

      case 'CALL_PHONE': {
        useNextLink = false

        href = `tel:${link.payload.phoneNumber}`

        break
      }

      case 'SCROLL_TO_ELEMENT': {
        useNextLink = false

        href = `#${elementId ?? ''}`

        block = link.payload.block

        break
      }

      default:
        throw new RangeError(`Invalid link type "${(link as any).type}."`)
    }
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick(event)

    if (event.defaultPrevented) return

    /**
     * When we introduced `next/link` instead of just `a` element slate no longer prevented link from navigating within
     * content mode. This is a hack to compensate for what would be expected as slate's default behavior.
     * On upgrade of slate this can be reevaluated.
     */
    if (event.currentTarget.isContentEditable) return event.preventDefault()

    if (link && link.type === 'SCROLL_TO_ELEMENT') {
      let hash: string | undefined

      try {
        if (href != null) hash = new URL(`http://www.example.com/${href}`).hash
      } catch (error) {
        console.error(`Link received invalid href: ${href}`, error)
      }

      if (href != null && hash != null && href === hash) {
        event.preventDefault()
        const view = event.view as unknown as Window

        scrollIntoView(view.document.querySelector(hash)!, {
          behavior: 'smooth',
          block,
        })

        if (view.location.hash !== hash) view.history.pushState({}, '', hash)
      }
    }
  }

  if (useNextLink && href != null) {
    return (
      <NextLink
        {...restOfProps}
        ref={ref}
        target={target}
        onClick={handleClick}
        href={href}
        {...(hasLocalizedPathname && {
          locale: false,
        })}
        // Next.js v12 has legacyBehavior set to true by default
        legacyBehavior={false}
      />
    )
  }

  // eslint-disable-next-line
  return <a {...restOfProps} ref={ref} href={href} target={target} onClick={handleClick} />
})
