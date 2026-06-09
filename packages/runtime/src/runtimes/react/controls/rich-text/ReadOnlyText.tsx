import { ForwardedRef, forwardRef } from 'react'
import { Descendant, Text } from 'slate'

import { Slate, RichTextValue, richTextDTOtoDAO } from '@makeswift/controls'

import { useResponsiveStyle } from '../../../../components/utils/responsive-style'
import { InlineType, BlockType } from '../../../../slate/types'
import useEnhancedTypography, { useTypographyStyle } from '../typography'
import { Link } from '../../../../components/shared/Link'
import { useStyle } from '../../css-runtime/hooks/use-style'
import { CSSObject } from '@emotion/serialize'
import clsx from 'clsx'

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
      className={clsx(width, margin)}
    >
      {descendantsAsString === '' ? <Placeholder /> : <Descendants descendants={descendants} />}
    </div>
  )
})

export default ReadOnlyText

function Placeholder({ text = 'Write some text...' }: { text?: string }) {
  const { className, styleElement } = useStyle({
    display: 'inline-block',
    width: 0,
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    opacity: 0.333,
    verticalAlign: 'text-top',
  })
  return (
    <>
      {styleElement}
      <span
        className={className}
      >
        {text}
      </span>
    </>
  )
}

export interface TextProps {
  descendant: Text
}

export function TextElement({ descendant }: TextProps) {
  const enhancedTypography = useEnhancedTypography(descendant.typography)
  const { className, styleElement } = useTypographyStyle(enhancedTypography)

  return (
    <>
      {styleElement}
      <span className={className}>
        {descendant.text === '' ? '\uFEFF' : descendant.text}
      </span>
    </>
  )
}

export interface InlineProps {
  descendant: Slate.Inline
}

function InlineElement({ descendant }: InlineProps) {
  const { className: linkClassName, styleElement: linkStyleElement } = useStyle({ textDecoration: 'none' })

  switch (descendant.type) {
    case InlineType.Code:
      return (
        <code>
          {linkStyleElement}
          <Descendants descendants={descendant.children} />
        </code>
      )

    case InlineType.SuperScript:
      return (
        <sup>
          {linkStyleElement}
          <Descendants descendants={descendant.children} />
        </sup>
      )

    case InlineType.SubScript:
      return (
        <sub>
          {linkStyleElement}
          <Descendants descendants={descendant.children} />
        </sub>
      )

    case InlineType.Link:
      return (
        <Link className={linkClassName} link={descendant.link ?? undefined}>
          {linkStyleElement}
          <Descendants descendants={descendant.children} />
        </Link>
      )
  }
}

export interface BlockProps {
  descendant: Slate.Block
}

export function BlockElement({ descendant }: BlockProps) {
  const responsiveBlockStyles = useResponsiveStyle([descendant.textAlign], ([textAlign = 'left']) => ({ textAlign }))
  const blockStyles: CSSObject = { margin: 0, ...responsiveBlockStyles }
  const { className: blockStylesClassName, styleElement: blockStylesStyleElement} = useStyle(blockStyles)
  const quoteStyles = {
    padding: '0.5em 10px',
    fontSize: '1.25em',
    fontWeight: '300',
    borderLeft: '5px solid rgba(0, 0, 0, 0.1)',
  }
  const { className: quoteStylesClassName, styleElement: quoteStylesStyleElement } = useStyle(quoteStyles)

  switch (descendant.type) {
    case BlockType.Default:
    case BlockType.Paragraph:
      return (
        <>
          {blockStylesStyleElement}
          <p className={blockStylesClassName}>
            <Descendants descendants={descendant.children} />
          </p>
        </>
      )
    case BlockType.Heading1:
      return (
        <>
          {blockStylesStyleElement}
          <h1 className={blockStylesClassName}>
            <Descendants descendants={descendant.children} />
          </h1>
        </>
      )
    case BlockType.Heading2:
      return (
        <>
          {blockStylesStyleElement}
          <h2 className={blockStylesClassName}>
            <Descendants descendants={descendant.children} />
          </h2>
        </>
      )
    case BlockType.Heading3:
      return (
        <>
          {blockStylesStyleElement}
          <h3 className={blockStylesClassName}>
            <Descendants descendants={descendant.children} />
          </h3>
        </>
      )
    case BlockType.Heading4:
      return (
        <>
          {blockStylesStyleElement}
          <h4 className={blockStylesClassName}>
            <Descendants descendants={descendant.children} />
          </h4>
        </>
      )
    case BlockType.Heading5:
      return (
        <>
          {blockStylesStyleElement}
          <h5 className={blockStylesClassName}>
            <Descendants descendants={descendant.children} />
          </h5>
        </>
      )
    case BlockType.Heading6:
      return (
        <>
          {blockStylesStyleElement}
          <h6 className={blockStylesClassName}>
            <Descendants descendants={descendant.children} />
          </h6>
        </>
      )
    case BlockType.BlockQuote:
      return (
        <>
          {blockStylesStyleElement}
          {quoteStylesStyleElement}
          <blockquote className={clsx(blockStylesClassName, quoteStylesClassName)}>
            <Descendants descendants={descendant.children} />
          </blockquote>
        </>
      )
    case BlockType.OrderedList:
      return (
        <>
          {blockStylesStyleElement}
          <ol className={blockStylesClassName} style={{ listStylePosition: 'inside' }}>
            <Descendants descendants={descendant.children} />
          </ol>
        </>
      )
    case BlockType.UnorderedList:
      return (
        <>
          {blockStylesStyleElement}
          <ul className={blockStylesClassName} style={{ listStylePosition: 'inside' }}>
            <Descendants descendants={descendant.children} />
          </ul>
        </>
      )
    case BlockType.ListItem:
      return (
        <>
          {blockStylesStyleElement}
          <li className={blockStylesClassName}>
            <Descendants descendants={descendant.children} />
          </li>
        </>
      )
    case BlockType.ListItemChild:
      return (
        <>
          {blockStylesStyleElement}
          <span className={blockStylesClassName}>
            <Descendants descendants={descendant.children} />
          </span>
        </>
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
