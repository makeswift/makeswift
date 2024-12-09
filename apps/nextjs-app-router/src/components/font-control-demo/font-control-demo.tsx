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
      className={'flex flex-col p-3 w-full text-3xl' + ' ' + className}
      ref={ref}
      style={{ ...font }}
    >
      <div>{text ?? 'Font Control Demo'}</div>
      <pre className="text-sm">{JSON.stringify({ text, font }, null, 2)}</pre>
    </div>
  )
})

export default FontControlDemo
