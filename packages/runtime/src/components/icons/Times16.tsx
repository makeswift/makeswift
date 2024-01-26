import { ComponentPropsWithoutRef } from 'react'

export function Times16(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} {...props}>
      <path
        fillRule="evenodd"
        d="M13.707 3.707a1 1 0 0 0-1.414-1.414L8 6.586 3.707 2.293a1 1 0 0 0-1.414 1.414L6.586 8l-4.293 4.293a1 1 0 1 0 1.414 1.414L8 9.414l4.293 4.293a1 1 0 0 0 1.414-1.414L9.414 8z"
        clipRule="evenodd"
      />
    </svg>
  )
}
