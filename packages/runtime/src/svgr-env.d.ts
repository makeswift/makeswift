declare module '*.svg' {
  import { ComponentPropsWithRef } from 'react'

  export default (props: ComponentPropsWithRef<'svg'>) => JSX.Element
}
