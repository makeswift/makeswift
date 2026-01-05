import Link from 'next/link'

import { clsx } from 'clsx'
import { ChevronRight } from 'lucide-react'

import { Stream, Streamable } from '@/vibes/soul/lib/streamable'
import { AnimatedUnderline } from '@/vibes/soul/primitives/animated-underline'
import * as Skeleton from '@/vibes/soul/primitives/skeleton'

export interface Breadcrumb {
  label: string
  href: string
}

export interface BreadcrumbsProps {
  breadcrumbs: Streamable<Breadcrumb[]>
  className?: string
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --breadcrumbs-font-family: var(--font-family-body);
 *   --breadcrumbs-primary-text: var(--foreground);
 *   --breadcrumbs-secondary-text: var(--contrast-500);
 *   --breadcrumbs-icon: var(--contrast-500);
 *   --breadcrumbs-hover: var(--primary);
 * }
 * ```
 */
export function Breadcrumbs({ breadcrumbs: streamableBreadcrumbs, className }: BreadcrumbsProps) {
  return (
    <Stream fallback={<BreadcrumbsSkeleton className={className} />} value={streamableBreadcrumbs}>
      {breadcrumbs => {
        if (breadcrumbs.length === 0) {
          return <BreadCrumbEmptyState className={className} />
        }

        return (
          <nav aria-label="breadcrumb" className={clsx(className)}>
            <ol className="@xl:text-base flex flex-wrap items-center gap-x-1.5 text-sm">
              {breadcrumbs.map(({ label, href }, index) => {
                if (index < breadcrumbs.length - 1) {
                  return (
                    <li className="inline-flex items-center gap-x-1.5" key={href}>
                      <Link className="group/underline focus:outline-hidden" href={href}>
                        <AnimatedUnderline className="text-(--breadcrumbs-primary-text,var(--foreground)) font-[family-name:var(--breadcrumbs-font-family,var(--font-family-body))] [background:linear-gradient(0deg,var(--breadcrumbs-hover,var(--primary)),var(--breadcrumbs-hover,var(--primary)))_no-repeat_left_bottom_/_0_2px]">
                          {label}
                        </AnimatedUnderline>
                      </Link>
                      <ChevronRight
                        aria-hidden="true"
                        className="text-(--breadcrumbs-icon,var(--contrast-500))"
                        size={20}
                        strokeWidth={1}
                      />
                    </li>
                  )
                }

                return (
                  <li
                    className="text-(--breadcrumbs-secondary-text,var(--contrast-500)) inline-flex items-center font-[family-name:var(--breadcrumbs-font-family,var(--font-family-body))]"
                    key={href}
                  >
                    <span aria-current="page" aria-disabled="true" role="link">
                      {label}
                    </span>
                  </li>
                )
              })}
            </ol>
          </nav>
        )
      }}
    </Stream>
  )
}

export function BreadcrumbsSkeleton({ className }: Pick<BreadcrumbsProps, 'className'>) {
  return (
    <Skeleton.Root
      className={clsx('group-has-[[data-pending]]/breadcrumbs:animate-pulse', className)}
      pending
    >
      <div className="@xl:text-base flex flex-wrap items-center gap-x-1.5 text-sm">
        <Skeleton.Text characterCount={4} className="rounded-sm text-lg" />
        <Skeleton.Icon icon={<ChevronRight aria-hidden className="h-5 w-5" strokeWidth={1} />} />
        <Skeleton.Text characterCount={6} className="rounded-sm text-lg" />
        <Skeleton.Icon icon={<ChevronRight aria-hidden className="h-5 w-5" strokeWidth={1} />} />
        <Skeleton.Text characterCount={6} className="rounded-sm text-lg" />
      </div>
    </Skeleton.Root>
  )
}

export function BreadCrumbEmptyState({ className }: Pick<BreadcrumbsProps, 'className'>) {
  return (
    <Skeleton.Root className={className}>
      <div className={clsx('min-h-[1lh]', className)} />
    </Skeleton.Root>
  )
}
