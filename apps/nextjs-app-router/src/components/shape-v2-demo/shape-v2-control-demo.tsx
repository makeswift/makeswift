import { Ref, forwardRef } from 'react'

type Props = {
  className?: string
  shapev2: {
    text?: string
    checkbox?: boolean
    color?: string
  }
  shapev2popover: {
    text?: string
    checkbox?: boolean
    color?: string
  }
}

export const FontControlDemo = forwardRef(function FontControlDemo(
  { className, shapev2, shapev2popover }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={'flex flex-col p-3 gap-3 w-full text-xl' + ' ' + className}
      ref={ref}
    >
      <div>Text: {shapev2.text}</div>
      <div>Checkbox: {shapev2.checkbox + ''}</div>
      <div className="flex flex-row gap-2">
        Color:{' '}
        <div
          className="w-10 h-10"
          style={{ backgroundColor: shapev2.color }}
        ></div>
      </div>

      <div>Text: {shapev2popover.text}</div>
      <div>Checkbox: {shapev2popover.checkbox + ''}</div>
      <div className="flex flex-row gap-2">
        Color:{' '}
        <div
          className="w-10 h-10"
          style={{ backgroundColor: shapev2popover.color }}
        ></div>
      </div>

      <pre className="text-sm">
        {JSON.stringify(
          {
            shapev2,
            shapev2popover,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )
})

export default FontControlDemo
