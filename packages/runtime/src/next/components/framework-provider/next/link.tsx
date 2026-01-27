'use client'

import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import NextLink from 'next/link'

import { type FrameworkContext } from '../../../../runtimes/react/components/framework-context'

import { useIsPagesRouter } from '../../../hooks/use-is-pages-router'

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

export const Link = forwardRef<HTMLAnchorElement>(function Link(
  { linkType, href, ...props }: ComponentPropsWithoutRef<FrameworkContext['Link']>,
  ref,
) {
  const useNextLink =
    href != null && (linkType === 'OPEN_PAGE' || (linkType === 'OPEN_URL' && isValidHref(href)))

  const isPagesRouter = useIsPagesRouter()

  if (useNextLink) {
    return (
      <NextLink
        {...props}
        ref={ref}
        href={href}
        {...(isPagesRouter ? { locale: false } : {})}
        // Next.js v12 has legacyBehavior set to true by default
        legacyBehavior={false}
      />
    )
  }

  return <a {...props} ref={ref} href={href} />
})
