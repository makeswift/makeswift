import { cx } from '@emotion/css'
import { RenderElementProps } from 'slate-react'
import { useResponsiveStyle } from '../../../../../../components/utils/responsive-style'
import { Block, BlockType } from '../../../../../../slate'
import { useStyle } from '../../../../use-style'

export interface InlineRenderElementProps extends RenderElementProps {
  element: Block
}

export function BlockElement({ element, attributes, children }: InlineRenderElementProps) {
  const blockStyles = [
    useStyle({ margin: 0 }),
    useStyle(useResponsiveStyle([element.textAlign], ([textAlign = 'left']) => ({ textAlign }))),
  ]

  const quoteStyles = useStyle({
    padding: '0.5em 10px',
    fontSize: '1.25em',
    fontWeight: '300',
    borderLeft: '5px solid rgba(0, 0, 0, 0.1)',
  })

  switch (element.type) {
    case BlockType.Default:
    case BlockType.Paragraph:
      return (
        <p {...attributes} className={cx(...blockStyles)}>
          {children}
        </p>
      )
    case BlockType.Heading1:
      return (
        <h1 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h1>
      )
    case BlockType.Heading2:
      return (
        <h2 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h2>
      )
    case BlockType.Heading3:
      return (
        <h3 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h3>
      )
    case BlockType.Heading4:
      return (
        <h4 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h4>
      )
    case BlockType.Heading5:
      return (
        <h5 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h5>
      )
    case BlockType.Heading6:
      return (
        <h6 {...attributes} className={cx(...blockStyles)}>
          {children}
        </h6>
      )
    case BlockType.BlockQuote:
      return (
        <blockquote {...attributes} className={cx(...blockStyles, quoteStyles)}>
          {children}
        </blockquote>
      )
    case BlockType.OrderedList:
      return (
        <ol {...attributes} className={cx(...blockStyles)} style={{ listStylePosition: 'inside' }}>
          {children}
        </ol>
      )
    case BlockType.UnorderedList:
      return (
        <ul {...attributes} className={cx(...blockStyles)} style={{ listStylePosition: 'inside' }}>
          {children}
        </ul>
      )
    case BlockType.ListItem:
      return (
        <li {...attributes} className={cx(...blockStyles)}>
          {children}
        </li>
      )
    case BlockType.ListItemChild:
      return (
        <span {...attributes} className={cx(...blockStyles)}>
          {children}
        </span>
      )
  }
}
