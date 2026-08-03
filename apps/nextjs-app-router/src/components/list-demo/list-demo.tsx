import { type Ref, type ReactNode, forwardRef, Fragment } from 'react'

type Props = {
  className?: string
  list: {
    text?: string
    checkbox?: boolean
    color?: string
    slot: ReactNode
    listOfSlots: ReactNode[]
  }[]
}

export const ListDemo = forwardRef(function FontControlDemo(
  { className, list }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={'flex flex-col p-3 gap-3 w-full text-xl' + ' ' + className}
      ref={ref}
    >
      {list.map((item, i) => (
        <div key={i} style={item.color ? { color: item.color } : {}}>
          <div>Text: {item.text}</div>
          <div>Checkbox: {`${item.checkbox}`}</div>
          {item.slot}
          <div>List of slots:</div>
          {item.listOfSlots.map((item, i) => (
            <Fragment key={i}>{item}</Fragment>
          ))}
        </div>
      ))}
    </div>
  )
})

export default ListDemo
