import 'server-only'

import {
  Fragment,
  type PropsWithChildren,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { MarkdownAsync } from 'react-markdown'

// Import all markdown files at build time
export const markdownFiles = import.meta.glob('/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

export async function RscKitchenSink({
  className,
  bgColor,
  red,
  number = 0,
  link,
  listOfLinks,
  group,
  listOfSlots,
  listOfRichTexts,
  listOfGroups,
  richText,
  slot,
  showMarkdown,
  filename,
}: {
  className?: string
  bgColor?: string
  red?: boolean
  number?: number
  link: { href: string; target?: string }
  listOfLinks: { href: string; target?: string }[]
  group: {
    bgColor?: string
    groupSlot: ReactNode
    groupRichText: ReactNode
    slotGroups: { slot: ReactNode }[]
  }
  listOfSlots: ReactNode[]
  listOfRichTexts: ReactNode[]
  listOfGroups: {
    name: string
    bgColor?: string
    slot: ReactNode
    richText: ReactNode
    combobox: string
    number?: number
  }[]
  richText: ReactNode
  slot: ReactNode
  showMarkdown: boolean
  filename?: string
}) {
  const files = Object.keys(markdownFiles)
  const filePath = filename ?? files[0]

  const markdown = showMarkdown
    ? filePath && markdownFiles[filePath]
      ? await markdownFiles[filePath]()
      : 'No markdown files found.'
    : null

  return (
    <div
      className={className}
      style={{
        backgroundColor: bgColor ?? 'white',
        color: red ? 'red' : 'black',
      }}
    >
      <Section title="Number">{number}</Section>
      <Section title="Bg color">{bgColor}</Section>
      <Section title="Checkbox ('Red')">{`${red}`}</Section>
      <Section title="Link">{JSON.stringify(link)}</Section>
      <Section title="List of links">
        {listOfLinks?.map((l, i) => (
          <div key={i}>Resolved link: {JSON.stringify(l)}</div>
        ))}
      </Section>
      <Section title="Rich text">{richText}</Section>
      <Section title="Slot">{slot}</Section>
      <Section title="Group" style={{ backgroundColor: group.bgColor }}>
        <SubSection title="Group slot">{group.groupSlot}</SubSection>
        <SubSection title="Group rich text">{group.groupRichText}</SubSection>
        <SubSection title="Group's list of slot groups">
          {group.slotGroups.map(({ slot }, i) => (
            <Fragment key={i}>{slot}</Fragment>
          ))}
        </SubSection>
      </Section>
      <Section title="List of slots">
        {listOfSlots.map((slot, i) => (
          <Fragment key={i}>{slot}</Fragment>
        ))}
      </Section>
      <Section title="List of rich texts">
        {listOfRichTexts.map((richText, i) => (
          <Fragment key={i}>{richText}</Fragment>
        ))}
      </Section>
      <Section title="List of groups">
        {listOfGroups.map(
          ({ name, bgColor, slot, richText, combobox, number }, i) => (
            <SubSection
              key={i}
              title={name}
              style={{ backgroundColor: bgColor }}
            >
              <h4 className="font-bold">Slot:</h4>
              {slot}
              <h4 className="font-bold">Rich text:</h4>
              {richText}
              <h4 className="font-bold">Combobox (TV Show):</h4>
              {combobox}
              <h4 className="font-bold">Number:</h4>
              {number}
            </SubSection>
          ),
        )}
      </Section>
      <Section title="Markdown">
        {markdown ? <MarkdownAsync>{markdown}</MarkdownAsync> : null}
      </Section>
    </div>
  )
}

const Section = ({
  title,
  style,
  children,
}: PropsWithChildren<{ title: string; style?: CSSProperties }>) => (
  <div className="px-2 my-1" style={style}>
    <hr className="border border-black" />
    <h2 className="font-bold text-xl">{title}</h2>
    {children}
  </div>
)

const SubSection = ({
  title,
  style,
  children,
}: PropsWithChildren<{ title: string; style?: CSSProperties }>) => (
  <div className="px-2" style={style}>
    <h3 className="font-bold text-lg border-b-[0.5px] border-black my-1">
      {title}
    </h3>
    {children}
  </div>
)
