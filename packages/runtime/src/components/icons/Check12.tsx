import { ComponentPropsWithoutRef } from 'react'

export function Check12(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} {...props}>
      <path
        fillRule="evenodd"
        d="M11.707 1.793a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L4 8.086l6.293-6.293a1 1 0 0 1 1.414 0"
        clipRule="evenodd"
      />
    </svg>
  )
}
