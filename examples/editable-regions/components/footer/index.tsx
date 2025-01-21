import Image from 'next/image'
import Link from 'next/link'
import { type Ref, forwardRef } from 'react'

import { clsx } from 'clsx'

interface Link {
  href: string
  label: string
}

interface Section {
  title: string
  links: Link[]
}

interface Props {
  className?: string
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  sections: Section[]
  copyright?: string
}

export const Footer = forwardRef(function Footer(
  { className, logo, sections, copyright }: Props,
  ref: Ref<HTMLDivElement>
) {
  return (
    <footer className={clsx('border-b-4 border-t @container', className)} ref={ref}>
      <div className="mx-auto max-w-screen-2xl px-4 py-6 @xl:px-6 @xl:py-10 @4xl:px-8 @4xl:py-12">
        <div className="flex flex-col justify-between gap-x-8 gap-y-12 @3xl:flex-row">
          <div className="flex flex-col gap-4 @3xl:w-1/3 @3xl:gap-6">
            {logo != null && <Image {...logo} />}
          </div>
          <div className="grid w-full flex-1 gap-y-8 [grid-template-columns:_repeat(auto-fill,_minmax(200px,_1fr))] @xl:gap-y-10">
            {sections.map(({ title, links }, i) => (
              <div className="pr-8" key={i}>
                {title != null && <span className="mb-3 block font-semibold">{title}</span>}

                <ul>
                  {links.map((link, idx) => {
                    return (
                      <li key={idx}>
                        <Link
                          className="block rounded-lg py-2 text-sm font-medium focus-visible:outline-0 focus-visible:ring-2"
                          href={link.href}
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {copyright != null && (
          <div className="flex flex-col-reverse items-start gap-y-8 pt-16 @3xl:flex-row @3xl:items-center @3xl:pt-20">
            <p className="flex-1 text-sm">{copyright}</p>
          </div>
        )}
      </div>
    </footer>
  )
})
