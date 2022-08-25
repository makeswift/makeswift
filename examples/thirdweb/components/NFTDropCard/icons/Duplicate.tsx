import { ComponentPropsWithoutRef } from 'react'

export function Duplicate(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 4H3.5C1.84315 4 0.5 5.34315 0.5 7V12.5C0.5 14.1569 1.84315 15.5 3.5 15.5H9C10.6569 15.5 12 14.1569 12 12.5V11.5"
        stroke="black"
      />
      <rect
        x="4.5"
        y="0.5"
        width="11"
        height="11"
        rx="2.5"
        stroke="currentColor"
      />
    </svg>
  )
}
