import { ComponentPropsWithoutRef } from 'react'

export function Diamond(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      {...props}
      width="17"
      height="16"
      viewBox="0 0 17 16"
      stroke="currentColor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.5 15.2238L1.13466 6.47743L4.75461 1.5H12.2454L15.8653 6.47743L8.5 15.2238Z" />
      <path d="M1.5 6.5H15.5" />
      <path d="M5 6L8.5 14L12 6" strokeLinejoin="round" />
      <path d="M4.5 2L5.5 6.5L8.5 1.5L11.5 6.5L12.5 2" strokeLinejoin="round" />
    </svg>
  )
}
