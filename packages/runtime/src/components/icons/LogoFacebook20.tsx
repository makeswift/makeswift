import { ComponentPropsWithoutRef } from 'react'

export function LogoFacebook20(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path d="M20 10.061C20 4.504 15.523 0 10 0S0 4.504 0 10.061C0 15.083 3.657 19.245 8.437 20v-7.031H5.898v-2.908h2.539V7.845c0-2.522 1.494-3.915 3.778-3.915 1.094 0 2.238.196 2.238.196v2.477h-1.261c-1.242 0-1.63.775-1.63 1.571v1.887h2.774l-.443 2.908h-2.331V20C16.343 19.245 20 15.083 20 10.061Z" />
    </svg>
  )
}
