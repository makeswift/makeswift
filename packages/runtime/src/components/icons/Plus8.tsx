import { ComponentPropsWithoutRef } from 'react'

export function Plus8(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8} {...props}>
      <path d="M4 0a1 1 0 0 0-1 1v2H1a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V5h2a1 1 0 0 0 0-2H5V1a1 1 0 0 0-1-1" />
    </svg>
  )
}
