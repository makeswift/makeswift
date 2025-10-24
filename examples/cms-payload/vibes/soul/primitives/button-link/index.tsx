import Link from 'next/link'
import { ComponentPropsWithoutRef } from 'react'

import { clsx } from 'clsx'

export interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost'
  size?: 'large' | 'medium' | 'small' | 'x-small'
  shape?: 'pill' | 'rounded' | 'square' | 'circle'
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --button-focus: var(--primary);
 *   --button-font-family: var(--font-family-body);
 *   --button-primary-background: var(--primary);
 *   --button-primary-background-hover: var(--primary-highlight);
 *   --button-primary-text: var(--foreground);
 *   --button-primary-border: var(--primary);
 *   --button-secondary-background: var(--foreground);
 *   --button-secondary-background-hover: var(--background);
 *   --button-secondary-text: var(--background);
 *   --button-secondary-border: var(--foreground);
 *   --button-tertiary-background: var(--background);
 *   --button-tertiary-background-hover: var(--contrast-100);
 *   --button-tertiary-text: var(--foreground);
 *   --button-tertiary-border: var(--contrast-200);
 *   --button-ghost-background: transparent;
 *   --button-ghost-background-hover: color-mix(in oklab, var(--foreground) 5%, transparent);
 *   --button-ghost-text: var(--foreground);
 *   --button-ghost-border: transparent;
 * }
 * ```
 */
export function ButtonLink({
  variant = 'primary',
  size = 'large',
  shape = 'pill',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={clsx(
        'font-(family-name:--button-font-family) focus-visible:ring-(--button-focus,var(--primary)) focus-visible:outline-hidden relative z-0 inline-flex h-fit select-none items-center justify-center overflow-hidden border text-center font-semibold leading-normal after:absolute after:inset-0 after:-z-10 after:-translate-x-[105%] after:transition after:duration-300 after:[animation-timing-function:cubic-bezier(0,0.25,0,1)] hover:after:translate-x-0 focus-visible:ring-2 focus-visible:ring-offset-2',
        {
          primary:
            'border-(--button-primary-border,var(--primary)) bg-(--button-primary-background,var(--primary)) text-(--button-primary-text,var(--foreground)) after:bg-(--button-primary-background-hover,var(--primary-highlight))',
          secondary:
            'border-(--button-secondary-border,var(--foreground)) bg-(--button-secondary-background,var(--foreground)) text-(--button-secondary-text,var(--background)) after:bg-(--button-secondary-background-hover,var(--background))',
          tertiary:
            'border-(--button-tertiary-border,var(--contrast-200)) bg-(--button-tertiary-background,var(--background)) text-(--button-tertiary-text,var(--foreground)) after:bg-(--button-tertiary-background-hover,var(--contrast-100))',
          ghost:
            'border-(--button-ghost-border,transparent) bg-(--button-ghost-background,transparent) text-(--button-ghost-text,var(--foreground)) after:bg-(--button-ghost-background-hover,color-mix(in_oklab,var(--foreground)_5%,transparent))',
        }[variant],
        {
          'x-small': 'min-h-8 text-xs',
          small: 'min-h-10 text-sm',
          medium: 'min-h-12 text-base',
          large: 'min-h-14 text-base',
        }[size],
        shape !== 'circle' &&
          {
            'x-small': 'gap-x-2 px-3 py-1.5',
            small: 'gap-x-2 px-4 py-2.5',
            medium: 'gap-x-2.5 px-5 py-3',
            large: 'gap-x-3 px-6 py-4',
          }[size],
        {
          pill: 'rounded-full after:rounded-full',
          rounded: 'rounded-lg after:rounded-lg',
          square: 'rounded-none after:rounded-none',
          circle: 'aspect-square rounded-full after:rounded-full',
        }[shape],
        className
      )}
    >
      <span className={clsx(variant === 'secondary' && 'mix-blend-difference')}>{children}</span>
    </Link>
  )
}
