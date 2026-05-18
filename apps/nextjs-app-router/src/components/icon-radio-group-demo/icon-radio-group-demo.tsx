import { Ref, forwardRef } from 'react'

type Props = {
  className?: string
  alignment: string
  inlineStyle?: string
}

export const IconRadioGroupDemo = forwardRef(function IconRadioGroupDemo(
  { className, alignment, inlineStyle }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={'flex flex-col gap-4 p-4 w-full text-lg' + ' ' + className}
      ref={ref}
    >
      <div>
        <span className="font-semibold">Alignment:</span>{' '}
        <span style={{ textAlign: alignment as any, display: 'block' }}>
          {alignment}
        </span>
      </div>

      <div>
        <span className="font-semibold">Inline Style:</span>{' '}
        <span>{inlineStyle ?? 'none'}</span>
      </div>

      <pre className="text-sm bg-gray-100 rounded p-2">
        {JSON.stringify({ alignment, inlineStyle }, null, 2)}
      </pre>
    </div>
  )
})

export default IconRadioGroupDemo
