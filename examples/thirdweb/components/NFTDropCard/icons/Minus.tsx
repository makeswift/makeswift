import { ComponentPropsWithoutRef } from 'react'

export function Minus(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      {...props}
      width="12"
      height="2"
      viewBox="0 0 12 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="11.5"
        y="0.5"
        width="1"
        height="11"
        transform="rotate(90 11.5 0.5)"
        fill="black"
      />
    </svg>
  )
}
