import { forwardRef, ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<'div'>

export default forwardRef<HTMLDivElement, Props>(function Block({ ...restOfProps }: Props, ref) {
  return <div {...restOfProps} ref={ref} />
})
