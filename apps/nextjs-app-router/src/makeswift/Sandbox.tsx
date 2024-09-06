import { ReactNode, MouseEvent } from 'react'

type Props = {
  className?: string
  // styleV2?: string
  // styleV3?: string
  link: {
    href: string
    target?: '_blank' | '_self'
    onClick?: (e: MouseEvent) => void
  }
  number: number
  text: string
  textArea: string
  color: string
  faultySelect: 'red' | 'green' | 'blue'
  numberList: (number | undefined)[]
  checkbox: boolean
  imageUrl?: string
  shape: {
    checkbox: boolean
    colorList: string[]
    shapeNumber: number
    shapeTextInput: string
    shapeTextArea: string
    shapeSelect: 'red' | 'green' | 'blue'
  }
  list: { num: number; str: string; richTextShape: ReactNode }[]
  richText: ReactNode
  testimonials: { title: string; body: string }[]
  combobox?: { t: number }
  colorList?: string[]
  slot: ReactNode
  // typography: string
  // icon: string
}

export function Sandbox({
  list,
  slot,
  link,
  richText,
  ...restOfProps
}: Props): JSX.Element {
  // const texts = list?.map((item) => item.text)
  // const listWithoutText = list?.map(
  //   ({ text, ...itemWithoutText }) => itemWithoutText,
  // )

  return (
    <div className={restOfProps.className}>
      <pre>
        {JSON.stringify({ ...restOfProps }, null, 2)}
        {/* {texts} */}
        {slot}
        {list.map((item, i) => (
          <div key={i}>{item.richTextShape}</div>
        ))}
        <a {...link}>Test link</a>
        {richText}
      </pre>
    </div>
  )
}
