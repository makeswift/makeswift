import { cx } from '@emotion/css'
import { ForwardedRef, forwardRef } from 'react'
import { Descendant, Text } from 'slate'

import { Slate, RichTextValue, richTextDTOtoDAO } from '@makeswift/controls'

import { useResponsiveStyle } from '../../../../components/utils/responsive-style'
import { InlineType, BlockType } from '../../../../slate'
import { useStyle } from '../../use-style'
import useEnhancedTypography, { useTypographyClassName } from '../typography'
import { Link } from '../../../../components/shared/Link'

type Props = {
  id?: string
  text?: RichTextValue
  width?: string
  margin?: string
}

const ReadOnlyText = forwardRef(function ReadOnlyText(
  { id, text, width, margin }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const descendants = text == null ? [] : richTextDTOtoDAO(text)
  const descendantsAsString = getText(descendants)

  return (
    <div
      ref={ref}
      id={id}
      style={{
        /**
         * These are the default styles that Slate uses for its editable div.
         * https://github.com/ianstormtaylor/slate/blob/4bd15ed3950e3a0871f5d0ecb391bb637c05e59d/packages/slate-react/src/components/editable.tsx
         * Search for `disableDefaultStyles`
         */
        position: 'relative',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
      className={cx(width, margin)}
    >
      {descendantsAsString === '' ? <Placeholder /> : <Descendants descendants={descendants} />}
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

export interface TextProps {
  descendant: Text
}

export function TextElement({ descendant }: TextProps) {
  const enhancedTypography = useEnhancedTypography(descendant.typography)
  const typographyClassName = useTypographyClassName(enhancedTypography)

  return (
    <span className={typographyClassName}>
      {descendant.text === '' ? '\uFEFF' : descendant.text}
    </span>
  )
}

export interface InlineProps {
  descendant: Slate.Inline
}

function InlineElement({ descendant }: InlineProps) {
  const linkClassName = useStyle({ textDecoration: 'none' })

  switch (descendant.type) {
    case InlineType.Code:
      return (
        <code>
          <Descendants descendants={descendant.children} />
        </code>
      )

    case InlineType.SuperScript:
      return (
        <sup>
          <Descendants descendants={descendant.children} />
        </sup>
      )

    case InlineType.SubScript:
      return (
        <sub>
          <Descendants descendants={descendant.children} />
        </sub>
      )

    case InlineType.Link:
      return (
        <Link className={linkClassName} link={descendant.link ?? undefined}>
          <Descendants descendants={descendant.children} />
        </Link>
      )
  }
}

export interface BlockProps {
  descendant: Slate.Block
}

export function BlockElement({ descendant }: BlockProps) {
  const blockStyles = [
    useStyle({ margin: 0 }),
    useStyle(useResponsiveStyle([descendant.textAlign], ([textAlign = 'left']) => ({ textAlign }))),
  ]
  const quoteStyle = useStyle({
    padding: '0.5em 10px',
    fontSize: '1.25em',
    fontWeight: '300',
    borderLeft: '5px solid rgba(0, 0, 0, 0.1)',
  })

  switch (descendant.type) {
    case BlockType.Default:
    case BlockType.Paragraph:
      return (
        <p className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </p>
      )
    case BlockType.Heading1:
      return (
        <h1 className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </h1>
      )
    case BlockType.Heading2:
      return (
        <h2 className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </h2>
      )
    case BlockType.Heading3:
      return (
        <h3 className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </h3>
      )
    case BlockType.Heading4:
      return (
        <h4 className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </h4>
      )
    case BlockType.Heading5:
      return (
        <h5 className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </h5>
      )
    case BlockType.Heading6:
      return (
        <h6 className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </h6>
      )
    case BlockType.BlockQuote:
      return (
        <blockquote className={cx(...blockStyles, quoteStyle)}>
          <Descendants descendants={descendant.children} />
        </blockquote>
      )
    case BlockType.OrderedList:
      return (
        <ol className={cx(...blockStyles)} style={{ listStylePosition: 'inside' }}>
          <Descendants descendants={descendant.children} />
        </ol>
      )
    case BlockType.UnorderedList:
      return (
        <ul className={cx(...blockStyles)} style={{ listStylePosition: 'inside' }}>
          <Descendants descendants={descendant.children} />
        </ul>
      )
    case BlockType.ListItem:
      return (
        <li className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </li>
      )
    case BlockType.ListItemChild:
      return (
        <span className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </span>
      )
    default:
      return null
  }
}

function Descendants({ descendants }: { descendants: Descendant[] }) {
  return (
    <>
      {descendants.map((descendant, index) => {
        if (Slate.isText(descendant)) {
          return <TextElement key={index} descendant={descendant} />
        }

        switch (descendant.type) {
          case InlineType.Link:
          case InlineType.Code:
          case InlineType.SubScript:
          case InlineType.SuperScript:
            return <InlineElement key={index} descendant={descendant} />
          case BlockType.Heading1:
          case BlockType.Heading2:
          case BlockType.Heading3:
          case BlockType.Heading4:
          case BlockType.Heading5:
          case BlockType.Heading6:
          case BlockType.BlockQuote:
          case BlockType.Paragraph:
          case BlockType.Default:
          case BlockType.OrderedList:
          case BlockType.UnorderedList:
          case BlockType.ListItem:
          case BlockType.ListItemChild:
            return <BlockElement key={index} descendant={descendant} />
          default:
            return null
        }
      })}
    </>
  )
}

function isBlock(descendant: Descendant): descendant is Slate.Block {
  if ('text' in descendant) return false

  switch (descendant.type) {
    case BlockType.Heading1:
    case BlockType.Heading2:
    case BlockType.Heading3:
    case BlockType.Heading4:
    case BlockType.Heading5:
    case BlockType.Heading6:
    case BlockType.BlockQuote:
    case BlockType.Paragraph:
    case BlockType.Default:
    case BlockType.OrderedList:
    case BlockType.UnorderedList:
    case BlockType.ListItem:
    case BlockType.ListItemChild:
      return true

    default:
      return false
  }
}

function getTextByDescendant(descendant: Descendant): string {
  if ('text' in descendant) {
    return descendant.text ?? ''
  }

  switch (descendant.type) {
    case InlineType.Link:
    case InlineType.Code:
    case InlineType.SubScript:
    case InlineType.SuperScript:
      return descendant.children.map(descendant => getTextByDescendant(descendant)).join('') ?? ''
    case BlockType.Heading1:
    case BlockType.Heading2:
    case BlockType.Heading3:
    case BlockType.Heading4:
    case BlockType.Heading5:
    case BlockType.Heading6:
    case BlockType.BlockQuote:
    case BlockType.Paragraph:
    case BlockType.Default:
    case BlockType.OrderedList:
    case BlockType.UnorderedList:
    case BlockType.ListItem:
    case BlockType.ListItemChild:
      return (
        descendant.children
          .map(descendant => getTextByDescendant(descendant))
          .join(descendant.children.every(isBlock) ? '\n' : '') ?? ''
      )
    default:
      return ''
  }
}

function getText(descendant: Descendant[]): string {
  return descendant.map(getTextByDescendant).join('\n')
}
