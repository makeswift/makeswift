import { Ref, forwardRef } from 'react'

type Props = {
  className?: string
  font?: { fontFamily: string; fontStyle: string; fontWeight: number }
  text?: string
}

export const FontControlDemo = forwardRef(function FontControlDemo(
  { className, font, text }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      style={{ ...font }}
      className={'p-3 h-20 w-full' + ' ' + className}
      ref={ref}
    >
      {text ?? 'Font Control Demo'}
    </div>
  )
})

export default FontControlDemo
