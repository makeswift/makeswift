import { ComponentPropsWithoutRef } from 'react'

export function LogoX20(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path d="M11.647 8.469 18.932 0h-1.726L10.88 7.353 5.827 0H0l7.64 11.12L0 20h1.726l6.68-7.765L13.743 20h5.828zm-2.365 2.748-.774-1.107-6.16-8.81H5l4.971 7.11.774 1.107 6.462 9.242h-2.652z" />
    </svg>
  )
}
