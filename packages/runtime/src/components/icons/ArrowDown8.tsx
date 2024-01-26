import { ComponentPropsWithoutRef } from 'react'

export function ArrowDown8(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8} {...props}>
      <path d="M5 1a1 1 0 0 0-2 0v3.586l-.293-.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l2-2a1 1 0 0 0-1.414-1.414L5 4.586z" />
    </svg>
  )
}
