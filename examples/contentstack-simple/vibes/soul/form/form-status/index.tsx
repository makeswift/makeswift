import { clsx } from 'clsx'
import { CheckCircle, CircleAlert } from 'lucide-react'

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 *  :root {
 *    --form-status-light-background-error: var(--error-highlight);
 *    --form-status-light-text-error: var(--error-shadow);
 *    --form-status-light-background-success: var(--success-highlight);
 *    --form-status-light-text-success: var(--success-shadow);
 *    --form-status-dark-background-error: var(--error-highlight);
 *    --form-status-dark-text-error: var(--error-shadow);
 *    --form-status-dark-background-success: var(--success-highlight);
 *    --form-status-dark-text-success: var(--success-shadow);
 *  }
 * ```
 */
export function FormStatus({
  className,
  children,
  type = 'success',
  colorScheme = 'light',
  ...rest
}: React.ComponentPropsWithoutRef<'div'> & {
  type?: 'error' | 'success'
  colorScheme?: 'light' | 'dark'
}) {
  return (
    <div
      {...rest}
      className={clsx(
        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm',
        {
          light: {
            error:
              'bg-(--form-status-light-background-error,var(--error-highlight)) text-(--form-status-light-text-error,var(--error-shadow))',
            success:
              'bg-(--form-status-light-background-success,var(--success-highlight)) text-(--form-status-light-text-success,var(--success-shadow))',
          }[type],
          dark: {
            error:
              'bg-(--form-status-dark-background-error,var(--error-highlight)) text-(--form-status-dark-text-error,var(--error-shadow))',
            success:
              'bg-(--form-status-dark-background-success,var(--success-highlight)) text-(--form-status-dark-text-success,var(--success-shadow))',
          }[type],
        }[colorScheme],
        className
      )}
    >
      {type === 'error' && <CircleAlert className="shrink-0" size={20} strokeWidth={1.5} />}
      {type === 'success' && <CheckCircle className="shrink-0" size={20} strokeWidth={1.5} />}

      {children}
    </div>
  )
}
