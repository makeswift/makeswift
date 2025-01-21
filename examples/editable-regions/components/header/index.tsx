import Image from 'next/image'
import Link from 'next/link'
import React, { Ref, forwardRef } from 'react'

import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { clsx } from 'clsx'

interface Link {
  label: string
  href: string
}

interface Props {
  className?: string
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }

  links: Link[]
  linksPosition?: 'center' | 'left' | 'right'
}

export const Header = forwardRef(function Header(
  { className, logo, links, linksPosition = 'center' }: Props,
  ref: Ref<HTMLDivElement>
) {
  return (
    <NavigationMenu.Root
      className={clsx('relative mx-auto w-full max-w-screen-2xl @container', className)}
      delayDuration={0}
      ref={ref}
    >
      <div className="relative flex items-center justify-between gap-4 px-2 py-2 pl-3 pr-2 ring-0">
        {logo != null && (
          <div
            className={clsx(
              'flex items-center justify-start self-stretch',
              linksPosition === 'center' ? 'self-start' : ''
            )}
          >
            <Image {...logo} />
          </div>
        )}

        <ul
          className={clsx(
            'flex flex-1 gap-1',
            {
              left: 'justify-start',
              center: 'justify-center',
              right: 'justify-end',
            }[linksPosition]
          )}
        >
          {links.map((item, i) => (
            <NavigationMenu.Item key={i} value={i.toString()}>
              <NavigationMenu.Trigger asChild>
                <Link
                  className="inline-flex items-center whitespace-nowrap rounded-xl p-2.5 text-sm font-medium duration-200 focus-visible:outline-0 focus-visible:ring-2"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavigationMenu.Trigger>
            </NavigationMenu.Item>
          ))}
        </ul>
      </div>
    </NavigationMenu.Root>
  )
})
