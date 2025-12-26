import { clsx } from 'clsx'

export interface IconProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  strokeWidth?: number
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function CloseIcon({ className, size = 'md', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={clsx(sizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

export function MenuIcon({ className, size = 'md', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={clsx(sizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )
}

export function SearchIcon({ className, size = 'md', strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={clsx(sizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}

