import 'server-only'

import { Fragment, type ReactNode } from 'react'
import { MarkdownAsync } from 'react-markdown'

// Import all markdown files at build time
export const markdownFiles = import.meta.glob('/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

export async function RscKitchenSink({
  className,
  color,
  showMarkdown,
  filename,
  link,
  list,
  group,
  listOfSlots,
  listOfGroups,
  // richText,
  slot,
  red,
  number = 0,
}: {
  className?: string
  showMarkdown: boolean
  filename?: string
  color?: string
  red?: boolean
  number?: number
  link: { href: string; target?: string }
  list: { href: string; target?: string }[]
  group: {
    color?: string
    groupSlot: ReactNode
    slotGroups: { slot: ReactNode }[]
  }
  listOfSlots: ReactNode[]
  listOfGroups: { name: string; slot: ReactNode }[]
  // richText: ReactNode
  slot: ReactNode
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
        backgroundColor: color ?? group.color ?? 'white',
        color: red ? 'red' : 'black',
      }}
    >
      <div>Number: {number}</div>
      <div>Resolved link: {JSON.stringify(link)}</div>
      <div>List of links:</div>
      {list?.map((l, i) => (
        <div key={i}>Resolved link: {JSON.stringify(l)}</div>
      ))}
      {/* <div>Rich text:</div>
      {richText} */}
      <hr />
      <h3>Slot:</h3>
      {slot}
      <hr />
      <h3>Group slot:</h3>
      {group.groupSlot}
      <h4>Group's list of slot groups:</h4>
      {group.slotGroups.map(({ slot }, i) => (
        <Fragment key={i}>{slot}</Fragment>
      ))}
      <hr />
      <h3>List of slots:</h3>
      {listOfSlots.map((slot, i) => (
        <Fragment key={i}>{slot}</Fragment>
      ))}
      <hr />
      <h3>List of groups:</h3>
      {listOfGroups.map(({ name, slot }, i) => (
        <div key={i}>
          <h4>{name}</h4>
          {slot}
        </div>
      ))}
      <hr />
      {markdown ? <MarkdownAsync>{markdown}</MarkdownAsync> : null}
    </div>
  )
}
