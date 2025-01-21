'use client'

import { type ComponentPropsWithoutRef, type Ref, forwardRef, useMemo } from 'react'

import { Footer } from '@/components/footer'

import { mergeSections } from '../../utils/merge-sections'

type FooterProps = ComponentPropsWithoutRef<typeof Footer>

interface Props {
  logo: {
    show: boolean
    src?: string
    alt: string
    width?: number
  }
  sections: Array<{
    title: string
    links: Array<{
      label: string
      link: { href: string }
    }>
  }>
  copyright?: string
}

export const MakeswiftFooter = forwardRef(
  ({ logo: { show: showLogo, ...logo }, sections, copyright }: Props, ref: Ref<HTMLDivElement>) => {
    const footerLogo = useMemo(
      () => (showLogo && logo.src ? { src: logo.src, height: 1, ...logo } : undefined),
      [showLogo, ...Object.entries(logo)]
    )

    return (
      <Footer
        ref={ref}
        sections={combineSections(DEFAULT_SECTIONS, sections)}
        copyright={copyright}
        logo={footerLogo}
      />
    )
  }
)

function combineSections(
  defaultSections: FooterProps['sections'],
  makeswiftSections: Props['sections']
): FooterProps['sections'] {
  return mergeSections(
    defaultSections,
    makeswiftSections.map(({ title, links }) => ({
      title,
      links: links.map(({ label, link }) => ({ label, href: link.href })),
    })),
    (left, right) => ({ ...left, links: [...left.links, ...right.links] })
  )
}

const DEFAULT_SECTIONS = [
  {
    title: 'Product',
    links: [
      {
        href: '/features',
        label: 'Features',
      },
      {
        href: '/pricing',
        label: 'Pricing',
      },
      {
        href: '/integrations',
        label: 'Integrations',
      },
    ],
  },
  {
    title: 'Company',
    links: [
      {
        href: '/about',
        label: 'About',
      },
      {
        href: '/careers',
        label: 'Careers',
      },
      {
        href: '/press',
        label: 'Press',
      },
    ],
  },
  {
    title: 'Resources',
    links: [
      {
        href: '/docs',
        label: 'Documentation',
      },
      {
        href: '/status',
        label: 'Status',
      },
      {
        href: '/privacy',
        label: 'Privacy',
      },
      {
        href: '/terms',
        label: 'Terms',
      },
    ],
  },
]
