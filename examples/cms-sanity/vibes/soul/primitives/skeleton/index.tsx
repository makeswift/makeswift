import { ReactNode } from 'react'

import { clsx } from 'clsx'

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --skeleton: color-mix(in oklab, var(--contrast-300) 15%, transparent);
 * }
 * ```
 */
function SkeletonRoot({
  className,
  children,
  pending = false,
  hideOverflow = false,
}: {
  className?: string
  children?: React.ReactNode
  pending?: boolean
  hideOverflow?: boolean
}) {
  return (
    <div
      className={clsx('@container', hideOverflow && 'overflow-hidden', className)}
      data-pending={pending ? '' : undefined}
      role={pending ? 'status' : undefined}
    >
      {children}
      {pending && <span className="sr-only">Loading...</span>}
    </div>
  )
}

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'bg-(--skeleton,color-mix(in_oklab,var(--contrast-300)_15%,transparent))',
        className
      )}
    />
  )
}

function SkeletonText({
  characterCount = 10,
  className,
}: {
  characterCount?: number | 'full'
  className?: string
}) {
  return (
    <div className={clsx('flex h-[1lh] items-center', className)}>
      <div
        className={clsx(
          `bg-(--skeleton,color-mix(in_oklab,var(--contrast-300)_15%,transparent)) h-[1ex] max-w-full rounded-[inherit]`
        )}
        style={{ width: characterCount === 'full' ? '100%' : `${characterCount}ch` }}
      />
    </div>
  )
}

function SkeletonIcon({ className, icon }: { className?: string; icon: ReactNode }) {
  return (
    <div className={clsx('text-(--skeleton,var(--contrast-300)) opacity-25', className)}>
      {icon}
    </div>
  )
}

export { SkeletonIcon as Icon, SkeletonRoot as Root, SkeletonBox as Box, SkeletonText as Text }
