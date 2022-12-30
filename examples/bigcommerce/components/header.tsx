import Link from 'next/link'
import { MouseEvent } from 'react'

import { Cart } from './cart'
import { LocaleSwitcher } from './locale/locale-switcher'

type LinkValue = {
  href: string
  target: '_blank' | '_self' | undefined
  onClick(event: MouseEvent<HTMLElement>): void
}

type Props = {
  className?: string
  links: {
    text?: string
    link?: LinkValue
  }[]
}

export function Header({ className, links }: Props) {
  return (
    <div className={`${className} flex gap-3 flex-wrap justify-between items-center`}>
      <div className="flex space-x-5 items-center">
        <Link href={'/'}>
          <a>
            <svg
              width="28"
              height="40"
              viewBox="0 0 28 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.9655 0.991297L14 0L13.0345 0.991297C12.5079 1.50844 0.000174124 14.2671 0.000174124 21.6808C-0.0172755 25.1349 1.27735 28.4714 3.63084 31.0381C5.98434 33.6048 9.22778 35.217 12.7271 35.5604V40H15.3605L15.3601 35.5604C18.8439 35.1972 22.0659 33.576 24.4016 31.0113C26.737 28.447 28.0194 25.1215 27.9998 21.681C27.9998 14.2242 15.4921 1.50869 14.9655 0.991451L14.9655 0.991297ZM15.4045 5.25859C16.37 6.3792 17.5109 7.62934 18.6081 9.00849L15.4045 12.1549V5.25859ZM12.7711 12.1982L9.47963 8.96546C10.6206 7.54306 11.7618 6.24989 12.7711 5.12928V12.1982ZM12.7711 15.8621V24.0086L4.60823 15.9914C5.58321 14.2735 6.66784 12.6177 7.85591 11.0344L12.7711 15.8621ZM15.4045 15.8191L20.188 11.0774C21.3767 12.6604 22.4613 14.3161 23.4355 16.0344L15.3603 23.9654L15.4045 15.8191ZM2.67738 21.6812L2.67707 21.6809C2.72452 20.5817 2.97738 19.5005 3.4231 18.4912L12.727 27.6721V32.9307C9.93422 32.5934 7.36458 31.2617 5.50458 29.1887C3.64426 27.1153 2.62272 24.4442 2.63307 21.6808L2.67738 21.6812ZM15.3606 32.9311V27.6295L24.6206 18.5347C25.0633 19.5299 25.3162 20.5964 25.3667 21.6812C25.3798 24.4313 24.3702 27.0919 22.5279 29.1632C20.6856 31.2345 18.1371 32.5742 15.3605 32.9311H15.3606Z"
                fill="#335510"
              />
            </svg>
          </a>
        </Link>
        {links.map((link, i) => (
          <Link
            href={link.link?.href ?? '#'}
            target={link.link?.target}
            onClick={link.link?.onClick}
            key={i}
          >
            <a>{link.text}</a>
          </Link>
        ))}
      </div>

      <div className="flex items-center space-x-5">
        <LocaleSwitcher />
        <Cart />
      </div>
    </div>
  )
}
