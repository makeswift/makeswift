import { ComponentPropsWithoutRef } from 'react'

import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'
  size?: 'large' | 'medium' | 'small' | 'x-small'
  shape?: 'pill' | 'rounded' | 'square' | 'circle'
  loading?: boolean
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
 *   --button-loader-icon: var(--foreground);
 *   --button-danger-background: color-mix(in oklab, var(--error), white 30%);
 *   --button-danger-background-hover: var(--error-highlight);
 *   --button-danger-text: var(--foreground);
 *   --button-danger-border: color-mix(in oklab, var(--error), white 30%);
 * }
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'large',
  shape = 'pill',
  loading = false,
  type = 'button',
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      aria-busy={loading}
      className={clsx(
        'relative z-0 inline-flex h-fit items-center justify-center overflow-hidden border text-center font-(family-name:--button-font-family,var(--font-family-body)) leading-normal font-semibold select-none after:absolute after:inset-0 after:-z-10 after:-translate-x-[105%] after:transition-[opacity,translate] after:duration-300 after:[animation-timing-function:cubic-bezier(0,0.25,0,1)] focus-visible:ring-2 focus-visible:ring-(--button-focus,var(--primary)) focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-30',
        {
          primary:
            'border-(--button-primary-border,var(--primary)) bg-(--button-primary-background,var(--primary)) text-(--button-primary-text,var(--foreground)) after:bg-(--button-primary-background-hover,var(--primary-highlight))',
          secondary:
            'border-(--button-secondary-border,var(--foreground)) bg-(--button-secondary-background,var(--foreground)) text-(--button-secondary-text,var(--background)) after:bg-(--button-secondary-background-hover,var(--background))',
          tertiary:
            'border-(--button-tertiary-border,var(--contrast-200)) bg-(--button-tertiary-background,var(--background)) text-(--button-tertiary-text,var(--foreground)) after:bg-(--button-tertiary-background-hover,var(--contrast-100))',
          ghost:
            'border-(--button-ghost-border,transparent) bg-(--button-ghost-background,transparent) text-(--button-ghost-text,var(--foreground)) after:bg-(--button-ghost-background-hover,color-mix(in_oklab,var(--foreground)_5%,transparent))',
          danger:
            'border-(--button-danger-border,color-mix(in_oklab,var(--error),white_30%)) bg-(--button-danger-background,color-mix(in_oklab,var(--error),white_30%)) text-(--button-danger-text,var(--foreground)) after:bg-(--button-danger-background-hover,var(--error-highlight))',
        }[variant],
        {
          pill: 'rounded-full after:rounded-full',
          rounded: 'rounded-lg after:rounded-lg',
          square: 'rounded-none after:rounded-none',
          circle: 'rounded-full after:rounded-full',
        }[shape],
        !loading && !disabled && 'hover:after:translate-x-0',
        loading && 'pointer-events-none',
        className
      )}
      disabled={disabled}
      type={type}
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center transition-all duration-300 ease-in-out',
          loading ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100',
          shape === 'circle' && 'aspect-square',
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
          variant === 'secondary' && 'mix-blend-difference'
        )}
      >
        {children}
      </span>
      <span
        className={clsx(
          'absolute inset-0 grid place-content-center transition-all duration-300 ease-in-out',
          loading ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        <Loader2
          className={clsx(
            'animate-spin',
            variant === 'tertiary' && 'text-(--button-loader-icon,var(--foreground))'
          )}
        />
      </span>
    </button>
  )
}
