import { ComponentPropsWithoutRef } from 'react'

export function ChevronDown8(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8} {...props}>
      <path
        fillRule="evenodd"
        d="M.293 2.293a1 1 0 0 1 1.414 0L4 4.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414"
        clipRule="evenodd"
      />
    </svg>
  )
}
