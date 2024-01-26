import { ComponentPropsWithoutRef } from 'react'

export function LogoFacebook20(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} {...props}>
      <path d="M18.896 0H1.104C.494 0 0 .494 0 1.104v17.792C0 19.506.494 20 1.104 20h9.58v-7.734H8.086V9.238h2.598V7.01c0-2.583 1.577-3.989 3.881-3.989 1.104 0 2.053.082 2.33.119v2.699l-1.59.001c-1.254 0-1.496.596-1.496 1.47v1.928h2.997l-.39 3.028h-2.607V20h5.087c.61 0 1.104-.494 1.104-1.104V1.104C20 .494 19.506 0 18.896 0" />
    </svg>
  )
}
