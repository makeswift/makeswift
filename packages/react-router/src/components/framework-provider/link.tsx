import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { Link as RRLink } from 'react-router'

import { type FrameworkContext } from '@makeswift/runtime/unstable-framework-support'

export const Link = forwardRef<HTMLAnchorElement>(function Link(
  { linkType, href, ...props }: ComponentPropsWithoutRef<FrameworkContext['Link']>,
  ref,
) {
  const useRRLink = href != null && linkType === 'OPEN_PAGE'
  if (useRRLink) {
    return <RRLink {...props} ref={ref} to={href} prefetch="intent" />
  }

  return <a {...props} ref={ref} href={href} />
})
