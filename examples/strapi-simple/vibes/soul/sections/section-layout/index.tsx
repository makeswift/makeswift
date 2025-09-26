import { ReactNode } from 'react'

import { clsx } from 'clsx'

export type ContainerSize = 'md' | 'lg' | 'xl' | '2xl' | 'full'

export interface SectionLayoutProps {
  className?: string
  children: ReactNode
  containerSize?: ContainerSize
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --section-max-width-medium: 768px;
 *   --section-max-width-lg: 1024px;
 *   --section-max-width-xl: 1280px;
 *   --section-max-width-2xl: 1536px;
 * }
 * ```
 */
export function SectionLayout({ className, children, containerSize = '2xl' }: SectionLayoutProps) {
  return (
    <section className={clsx('@container overflow-hidden', className)}>
      <div
        className={clsx(
          'mx-auto px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20',
          {
            md: 'max-w-(--section-max-width-md,768px)',
            lg: 'max-w-(--section-max-width-lg,1024px)',
            xl: 'max-w-(--section-max-width-xl,1280px)',
            '2xl': 'max-w-(--section-max-width-2xl,1536px)',
            full: 'max-w-none',
          }[containerSize]
        )}
      >
        {children}
      </div>
    </section>
  )
}
