import { ComponentPropsWithoutRef } from 'react'

export function Plus(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      {...props}
      width="12"
      height="12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#000" d="M5.5.5h1v11h-1z" />
      <path fill="#000" d="M11.5 5.5v1H.5v-1z" />
    </svg>
  )
}
