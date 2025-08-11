'use client'

import { ComponentPropsWithoutRef, forwardRef, MouseEvent } from 'react'

import { LinkData } from '@makeswift/prop-controllers'

import { Link as LinkDef } from '../../../controls/link'

import { useResolvedValue } from '../../../runtimes/react/hooks/use-resolved-value'
import { useFrameworkContext } from '../../../runtimes/react/components/hooks/use-framework-context'

type BaseProps = {
  link?: LinkData
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => unknown
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'a'>, keyof BaseProps>

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

  const { Link: LinkComponent } = useFrameworkContext()

  return (
    <LinkComponent
      {...restOfProps}
      linkType={link?.type}
      ref={ref}
      href={href}
      target={target}
      onClick={handleClick}
    />
  )
})
