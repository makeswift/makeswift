import { Ref, forwardRef } from 'react'

type Props = {
  className?: string
  group: {
    text?: string
    checkbox?: boolean
    color?: string
  }
  groupPopover: {
    text?: string
    checkbox?: boolean
    color?: string
  }
}

export const GroupDemo = forwardRef(function FontControlDemo(
  { className, group, groupPopover }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={'flex flex-col p-3 gap-3 w-full text-xl' + ' ' + className}
      ref={ref}
    >
      <div>Text: {group.text}</div>
      <div>Checkbox: {group.checkbox + ''}</div>
      <div className="flex flex-row gap-2">
        Color:{' '}
        <div
          className="w-10 h-10"
          style={{ backgroundColor: group.color }}
        ></div>
      </div>

      <div>Text: {groupPopover.text}</div>
      <div>Checkbox: {groupPopover.checkbox + ''}</div>
      <div className="flex flex-row gap-2">
        Color:{' '}
        <div
          className="w-10 h-10"
          style={{ backgroundColor: groupPopover.color }}
        ></div>
      </div>

      <pre className="text-sm">
        {JSON.stringify(
          {
            group,
            groupPopover,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )
})

export default GroupDemo
