declare module '*.svg' {
  import { ComponentPropsWithRef } from 'react'

  const src: string
  export default src
  export const ReactComponent: (props: ComponentPropsWithRef<'svg'>) => JSX.Element
}
