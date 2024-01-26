import { ComponentPropsWithoutRef } from 'react'

export function CaretDown8(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8} {...props}>
      <path d="M1 2a1 1 0 0 0-.707 1.707l3 3a1 1 0 0 0 1.414 0l3-3A1 1 0 0 0 7 2z" />
    </svg>
  )
}
