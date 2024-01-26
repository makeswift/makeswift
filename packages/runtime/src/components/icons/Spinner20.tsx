import { ComponentPropsWithoutRef } from 'react'

export function Spinner20(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} {...props}>
      <g fill="none" strokeWidth={2} transform="translate(1 1)">
        <circle cx={9} cy={9} r={9} stroke="currentColor" strokeOpacity={0.4} />
        <path d="M9 18A9 9 0 0 0 9 0" />
      </g>
    </svg>
  )
}
