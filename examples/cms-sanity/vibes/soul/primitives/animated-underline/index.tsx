import { clsx } from 'clsx'

export interface AnimatedUnderlineProps {
  children: string
  className?: string
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --animated-underline-hover: var(--primary);
 *   --animated-underline-text: var(--foreground);
 *   --animated-underline-font-family: var(--font-family-body);
 * }
 * ```
 */
export function AnimatedUnderline({ className, children }: AnimatedUnderlineProps) {
  return (
    <span
      className={clsx(
        'font-(family-name:--animated-underline-font-family,var(--font-family-body)) text-(--animated-underline-text,var(--foreground)) origin-left font-semibold leading-normal transition-[background-size] duration-300 [background:linear-gradient(0deg,var(--animated-underline-hover,var(--primary)),var(--animated-underline-hover,var(--primary)))_no-repeat_left_bottom_/_0_2px] hover:bg-[size:100%_2px] group-focus/underline:bg-[size:100%_2px]',
        className
      )}
    >
      {children}
    </span>
  )
}
