import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef, ReactNode } from 'react'
import type { BlockJSON, DocumentJSON, InlineJSON, MarkJSON, NodeJSON, TextJSON } from 'slate'
import type {
  ElementIDValue,
  LinkValue,
  RichTextValue,
} from '../../../prop-controllers/descriptors'
import { useStyle } from '../../../runtimes/react/use-style'
import { Link } from '../../shared/Link'
import DeviceOverrideBlock from './components/RichTextEditor/components/Block'
import DeviceOverrideMark from './components/RichTextEditor/components/Mark'

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
}

const ReadOnlyText = forwardRef(function ReadOnlyText(
  { id, text, width, margin }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  // NOTE: Adding `object: 'document'` here is done to support some old bad data that didn't have
  // the `object` field in the document node. This was due to the value not being passed in the
  // `Props.RichText` preset.
  const document: DocumentJSON | null =
    text?.document == null ? null : { ...text.document, object: 'document' }
  const plaintext = document == null ? '' : getNodeText(document)

  return (
    <div ref={ref} id={id} className={cx(width, margin)}>
      {plaintext === '' ? <Placeholder /> : <Node {...document} />}
    </div>
  )
})

export default ReadOnlyText

function Placeholder({ text = 'Write some text...' }: { text?: string }) {
  return (
    <span
      className={useStyle({
        display: 'inline-block',
        width: 0,
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        opacity: 0.333,
        verticalAlign: 'text-top',
      })}
    >
      {text}
    </span>
  )
}

function Node(props: NodeJSON) {
  switch (props.object) {
    case 'document':
      return <Document {...props} />

    case 'block':
      return <Block {...props} />

    case 'inline':
      return <Inline {...props} />

    case 'text':
      return <Text {...props} />

    default:
      return null
  }
}

function Document({ nodes }: DocumentJSON) {
  return (
    <>
      {nodes?.map((node, idx) => (
        <Node key={idx.toString()} {...node} />
      ))}
    </>
  )
}

type OrderedListProps = ComponentPropsWithoutRef<'ol'>

function OrderedList(props: OrderedListProps) {
  return <ol className="ordered-list" {...props} style={{ listStylePosition: 'inside' }} />
}

type UnorderedListProps = ComponentPropsWithoutRef<'ul'>

function UnorderedList(props: UnorderedListProps) {
  return <ul className="unordered-list" {...props} style={{ listStylePosition: 'inside' }} />
}

type ListItemProps = ComponentPropsWithoutRef<'li'>

function ListItem(props: ListItemProps) {
  return <li className="list-item" {...props} />
}

type ListItemChildProps = ComponentPropsWithoutRef<'span'>

function ListItemChild(props: ListItemChildProps) {
  return <span className="list-item-child" {...props} />
}

function Block({ type, data, nodes }: BlockJSON) {
  const component = {
    paragraph: 'p',
    'heading-one': 'h1',
    'heading-two': 'h2',
    'heading-three': 'h3',
    'heading-four': 'h4',
    'heading-five': 'h5',
    'heading-six': 'h6',
    blockquote: 'blockquote',
    'ordered-list': OrderedList,
    'unordered-list': UnorderedList,
    'list-item': ListItem,
    'list-item-child': ListItemChild,
  }[type]

  return (
    <DeviceOverrideBlock as={component} textAlign={data?.textAlign}>
      {nodes?.map((node, idx) => (
        <Node key={idx.toString()} {...node} />
      ))}
    </DeviceOverrideBlock>
  )
}

function Inline({ type, nodes, data }: InlineJSON) {
  const children = nodes?.map((node, idx) => <Node key={idx.toString()} {...node} />)
  const linkClassName = useStyle({ textDecoration: 'none' })

  switch (type) {
    case 'code':
      return <code>{children}</code>

    case 'superscript':
      return <sup>{children}</sup>

    case 'subscript':
      return <sub>{children}</sub>

    case 'link':
      return (
        <Link className={linkClassName} link={data as LinkValue | undefined}>
          {children}
        </Link>
      )

    default:
      return <>{children}</>
  }
}

function Text({ marks, text = '' }: TextJSON) {
  return (
    <>
      {(marks ?? []).reduce(
        (element, mark) => (
          <Mark {...mark}>{element}</Mark>
        ),
        <>{text === '' ? '\uFEFF' : text}</>,
      )}
    </>
  )
}

const TYPOGRAPHY_MARK_TYPE = 'typography'

function Mark({ type, children, data }: MarkJSON & { children: ReactNode }) {
  if (type !== TYPOGRAPHY_MARK_TYPE) return <>{children}</>

  return <DeviceOverrideMark value={data?.value}>{children}</DeviceOverrideMark>
}

function getNodeText(node: NodeJSON): string {
  switch (node.object) {
    case 'document':
      return node?.nodes?.map(node => getNodeText(node)).join('\n') ?? ''

    case 'block':
      return (
        node?.nodes
          ?.map(node => getNodeText(node))
          .join(node.nodes.every(node => node.object === 'block') ? '\n' : '') ?? ''
      )

    case 'inline':
      return node?.nodes?.map(node => getNodeText(node)).join('') ?? ''

    case 'text':
      return node.text ?? ''

    default:
      return ''
  }
}
