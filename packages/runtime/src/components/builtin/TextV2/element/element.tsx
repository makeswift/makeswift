import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef } from 'react'
import { RenderElementProps } from 'slate-react'
import { ResponsiveValue } from '../../../../prop-controllers'
import { useStyle } from '../../../../runtimes/react/use-style'
import { responsiveStyle } from '../../../utils/responsive-style'
import { Descendant } from 'slate'
import { LinkControlData } from '../../../../controls'
import { Link } from '../../../shared/Link'
import { TextUnion } from '../leaf'

interface BaseBlockElement {
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>
  children: Descendant[]
}

interface ParagraphElement extends BaseBlockElement {
  type: 'paragraph'
}

interface BlockquoteElement extends BaseBlockElement {
  type: 'blockquote'
}

interface HeadingOneElement extends BaseBlockElement {
  type: 'heading-one'
}

interface HeadingTwoElement extends BaseBlockElement {
  type: 'heading-two'
}

interface HeadingThreeElement extends BaseBlockElement {
  type: 'heading-three'
}

interface HeadingFourElement extends BaseBlockElement {
  type: 'heading-four'
}

interface HeadingFiveElement extends BaseBlockElement {
  type: 'heading-five'
}

interface HeadingSixElement extends BaseBlockElement {
  type: 'heading-six'
}

interface UnorderedListElement extends BaseBlockElement {
  type: 'unordered-list'
}

interface OrderedListElement extends BaseBlockElement {
  type: 'ordered-list'
}

interface ListItemElement extends BaseBlockElement {
  type: 'list-item'
}

interface ListItemChildElement extends BaseBlockElement {
  type: 'list-item-child'
}

interface BaseInlineElement {
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>
  children: Array<TextUnion | InlineElementUnion>
}

interface CodeText extends BaseInlineElement {
  type: 'code'
}

interface SuperScriptText extends BaseInlineElement {
  type: 'superscript'
}
interface SubScriptText extends BaseInlineElement {
  type: 'subscript'
}
interface LinkText extends BaseInlineElement {
  type: 'link'
  link: LinkControlData
}

export const BlockTypes = {
  Paragraph: 'paragraph',
  Heading1: 'heading-one',
  Heading2: 'heading-two',
  Heading3: 'heading-three',
  Heading4: 'heading-four',
  Heading5: 'heading-five',
  Heading6: 'heading-six',
  BlockQuote: 'blockquote',
  UnorderedList: 'unordered-list',
  OrderedList: 'ordered-list',
  ListItem: 'list-item',
  ListItemChild: 'list-item-child',
} as const

export const InlineTypes = {
  Code: 'code',
  SuperScript: 'superscript',
  SubScript: 'subscript',
  Link: 'link',
} as const

export const ElementTypes = {
  ...BlockTypes,
  ...InlineTypes,
} as const

export type BlockElementUnion =
  | ParagraphElement
  | BlockquoteElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | UnorderedListElement
  | OrderedListElement
  | ListItemElement
  | ListItemChildElement

export type InlineElementUnion = CodeText | SuperScriptText | SubScriptText | LinkText

export type ElementUnion = BlockElementUnion | InlineElementUnion

function StyledLink({ className, ...restOfProps }: ComponentPropsWithoutRef<typeof Link>) {
  return <Link {...restOfProps} className={cx(useStyle({ textDecoration: 'none' }), className)} />
}

export function Element({ element, attributes, children }: RenderElementProps) {
  const blockStyles = [
    useStyle({ margin: 0 }),
    useStyle(responsiveStyle([element.textAlign], ([textAlign = 'left']) => ({ textAlign }))),
  ]
  switch (element.type) {
    // Inline Elements
    case ElementTypes.Code:
      return <code {...attributes}>{children}</code>
    case ElementTypes.SuperScript:
      return <sup {...attributes}>{children}</sup>
    case ElementTypes.SubScript:
      return <sub {...attributes}>{children}</sub>
    case ElementTypes.Link:
      return (
        <StyledLink {...attributes} link={element.link}>
          {children}
        </StyledLink>
      )

    // Block elements
    case ElementTypes.Paragraph:
      return (
        <p {...attributes} className={cx(...blockStyles)}>
          {children}
        </p>
      )
    case ElementTypes.Heading1:
      return (
        <h1 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h1>
      )
    case ElementTypes.Heading2:
      return (
        <h2 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h2>
      )
    case ElementTypes.Heading3:
      return (
        <h3 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h3>
      )
    case ElementTypes.Heading4:
      return (
        <h4 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h4>
      )
    case ElementTypes.Heading5:
      return (
        <h5 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h5>
      )
    case ElementTypes.Heading6:
      return (
        <h6 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h6>
      )
    case ElementTypes.BlockQuote:
      return (
        <blockquote
          {...attributes}
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
          {children}
        </blockquote>
      )

    case ElementTypes.OrderedList:
      return (
        <ol
          {...attributes}
          className={cx(...blockStyles, `${element.type}`)}
          style={{ listStylePosition: 'inside' }}
        >
          {children}
        </ol>
      )
    case ElementTypes.UnorderedList:
      return (
        <ul
          {...attributes}
          className={cx(...blockStyles, `${element.type}`)}
          style={{ listStylePosition: 'inside' }}
        >
          {children}
        </ul>
      )
    case ElementTypes.ListItem:
      return (
        <li {...attributes} className={cx(...blockStyles, `${element.type}`)}>
          {children}
        </li>
      )
    case ElementTypes.ListItemChild:
      return (
        <span {...attributes} className={cx(...blockStyles, `${element.type}`)}>
          {children}
        </span>
      )

    default:
      return children
  }
}
