import { ComponentPropsWithoutRef } from 'react'

export function LogoTwitch20(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path d="M1.406 0 0 3.433v14.03h5.001V20h2.812l2.656-2.537h4.063L20 12.238V0zm1.719 1.791h15v9.552L15 14.328h-5l-2.656 2.537v-2.537H3.125zm10 8.651h1.876V5.224h-1.876zm-5 0H10V5.224H8.125z" />
    </svg>
  )
}
