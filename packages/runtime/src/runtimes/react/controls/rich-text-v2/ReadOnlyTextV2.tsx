import { cx } from '@emotion/css'
import { ForwardedRef, forwardRef } from 'react'
import { useTypographyClassName } from '../../../../components/builtin/Text/components'
import useEnhancedTypography from '../../../../components/builtin/Text/components/Leaf/leaf'
import { useResponsiveStyle } from '../../../../components/utils/responsive-style'
import { RichTextV2ControlData } from '../../../../controls'
import { useStyle } from '../../use-style'
import { Descendant, Text } from 'slate'
import { Link } from '../../../../components/shared/Link'
import { Inline, InlineType, Block, BlockType } from '../../../../slate'

type Props = {
  text: RichTextV2ControlData
}

const ReadOnlyTextV2 = forwardRef(function ReadOnlyText(
  { text: descendants }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const descendantsAsString = getText(descendants)

  return (
    <div ref={ref}>
      {descendantsAsString === '' ? <Placeholder /> : <Descendants descendants={descendants} />}
    </div>
  )
})

export default ReadOnlyTextV2

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
  descendant: Inline
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
        <Link className={linkClassName} link={descendant.link}>
          <Descendants descendants={descendant.children} />
        </Link>
      )
  }
}

export interface BlockProps {
  descendant: Block
}

export function BlockElement({ descendant }: BlockProps) {
  const blockStyles = [
    useStyle({ margin: 0 }),
    useStyle(useResponsiveStyle([descendant.textAlign], ([textAlign = 'left']) => ({ textAlign }))),
  ]

  switch (descendant.type) {
    case BlockType.Text:
      return (
        <span className={cx(...blockStyles)}>
          <Descendants descendants={descendant.children} />
        </span>
      )
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
        <blockquote
          className={cx(
            ...blockStyles,
            useStyle({
              padding: '0.5em 10px',
              fontSize: '1.25em',
              fontWeight: '300',
              borderLeft: '5px solid rgba(0, 0, 0, 0.1)',
            }),
          )}
        >
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
  }
}

// reimplemented from slate source for code splitting
function isText(node: any): node is Text {
  if (typeof node === 'object' && 'text' in node) return true

  return false
}

function Descendants({ descendants }: { descendants: Descendant[] }) {
  return (
    <>
      {descendants.map((descendant, index) => {
        if (isText(descendant)) {
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
          case BlockType.BlockQuote:
          case BlockType.Text:
          case BlockType.Paragraph:
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

function isBlock(descendant: Descendant): descendant is Block {
  if (isText(descendant)) return false

  switch (descendant.type) {
    case BlockType.Heading1:
    case BlockType.Heading2:
    case BlockType.Heading3:
    case BlockType.BlockQuote:
    case BlockType.Paragraph:
    case BlockType.OrderedList:
    case BlockType.UnorderedList:
    case BlockType.ListItem:
    case BlockType.ListItemChild:
    case BlockType.Text:
      return true

    default:
      return false
  }
}

function getTextByDescendant(descendant: Descendant): string {
  if (isText(descendant)) {
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
    case BlockType.BlockQuote:
    case BlockType.Paragraph:
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
