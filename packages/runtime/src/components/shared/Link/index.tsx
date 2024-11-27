'use client'

import { ComponentPropsWithoutRef, forwardRef, MouseEvent } from 'react'
import NextLink from 'next/link'

import { LinkData } from '@makeswift/prop-controllers'

import { Link as LinkDef } from '../../../controls/link'
import { useResolvedValue } from '../../../runtimes/react/hooks/use-resolved-value'

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
  const {
    href,
    target,
    onClick: resolvedOnClick,
  } = useResolvedValue(link, (link, resourceResolver) =>
    LinkDef().resolveValue(link, resourceResolver),
  ) ?? {}

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick(event)

    if (event.defaultPrevented) return

    /**
     * When we introduced `next/link` instead of just `a` element slate no longer prevented link from navigating within
     * content mode. This is a hack to compensate for what would be expected as slate's default behavior.
     * On upgrade of slate this can be reevaluated.
     */
    if (event.currentTarget.isContentEditable) return event.preventDefault()

    return resolvedOnClick?.(event)
  }

  const useNextLink =
    href != null &&
    link &&
    (link.type === 'OPEN_PAGE' || (link.type === 'OPEN_URL' && isValidHref(link.payload.url)))

  if (useNextLink) {
    return (
      <NextLink
        {...restOfProps}
        ref={ref}
        target={target}
        onClick={handleClick}
        href={href}
        locale={false}
        // Next.js v12 has legacyBehavior set to true by default
        legacyBehavior={false}
      />
    )
  }

  // eslint-disable-next-line
  return <a {...restOfProps} ref={ref} href={href} target={target} onClick={handleClick} />
})
