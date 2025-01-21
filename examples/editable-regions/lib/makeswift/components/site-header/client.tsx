'use client'

import { type ComponentPropsWithoutRef, type Ref, forwardRef, useMemo } from 'react'

import { Header } from '@/components/header'

type HeaderProps = ComponentPropsWithoutRef<typeof Header>

interface Props {
  logo: {
    src?: string
    alt: string
    width?: number
  }

  links: Array<{
    label: string
    link: { href: string }
  }>

  linksPosition: 'center' | 'left' | 'right'
}

export const MakeswiftHeader = forwardRef(
  ({ links, logo, linksPosition }: Props, ref: Ref<HTMLDivElement>) => {
    const headerLogo = useMemo(
      () => (logo.src ? { src: logo.src, height: 1, ...logo } : undefined),
      [logo, ...Object.entries(logo)]
    )

    return (
      <Header
        ref={ref}
        logo={headerLogo}
        links={combineLinks(DEFAULT_LINKS, links)}
        linksPosition={linksPosition}
      />
    )
  }
)

function combineLinks(
  defaultLinks: HeaderProps['links'],
  links: Props['links']
): HeaderProps['links'] {
  return [
    ...defaultLinks,
    ...links.map(({ label, link }) => ({
      label,
      href: link.href,
    })),
  ]
}

const DEFAULT_LINKS = [
  {
    label: 'Product',
    href: '/product',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Company',
    href: '/company',
  },
]
