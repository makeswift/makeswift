import { ComponentPropsWithoutRef } from 'react'

export function LogoRss20(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} {...props}>
      <path d="M15 19C15 11.28 8.72 5 1 5a1 1 0 1 0 0 2c6.617 0 12 5.383 12 12a1 1 0 1 0 2 0m5 0C20 8.523 11.477 0 1 0a1 1 0 1 0 0 2c9.374 0 17 7.626 17 17a1 1 0 1 0 2 0m-10 0c0-4.963-4.037-9-9-9a1 1 0 1 0 0 2c3.859 0 7 3.141 7 7a1 1 0 1 0 2 0m-5-1.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
    </svg>
  )
}
