import { clsx } from 'clsx'

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loadingAriaLabel?: string
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --spinner-base: #e5e7eb;
 *   --spinner-ring: #3b82f6;
 * }
 * ```
 */
export function Spinner({ size = 'sm', loadingAriaLabel = 'Loading...' }: SpinnerProps) {
  return (
    <span
      aria-label={loadingAriaLabel}
      className={clsx(
        'box-border inline-block animate-spin rounded-full border-gray-200 border-b-blue-500',
        {
          xs: 'h-5 w-5 border-2',
          sm: 'h-6 w-6 border-2',
          md: 'h-10 w-10 border-[3px]',
          lg: 'h-14 w-14 border-4',
        }[size]
      )}
      role="status"
    />
  )
}
