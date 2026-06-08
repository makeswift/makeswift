import { RenderElementProps } from 'slate-react'
import { Slate } from '@makeswift/controls'

import { useResponsiveStyle } from '../../../../../../components/utils/responsive-style'
import { BlockType } from '../../../../../../slate/types'
import { useStyle } from '../../../../css-runtime/hooks/use-style'
import clsx from 'clsx'

export interface InlineRenderElementProps extends RenderElementProps {
  element: Slate.Block
}

export function BlockElement({ element, attributes, children }: InlineRenderElementProps) {
  const responsiveBlockStyles = useResponsiveStyle([element.textAlign], ([textAlign = 'left']) => ({ textAlign }))
  const { className: blockStylesClassName, renderStaticStyle: renderBlockStyle } = useStyle({ margin: 0, ...responsiveBlockStyles })

  const quoteStyles = {
    padding: '0.5em 10px',
    fontSize: '1.25em',
    fontWeight: '300',
    borderLeft: '5px solid rgba(0, 0, 0, 0.1)'
  }
  const { className: quoteStylesClassName, renderStaticStyle: renderQuoteStyle } = useStyle(quoteStyles)

  switch (element.type) {
    case BlockType.Default:
    case BlockType.Paragraph:
      return (
        <>
          {renderBlockStyle()}
          <p {...attributes} className={blockStylesClassName}>
            {children}
          </p>
        </>
      )
    case BlockType.Heading1:
      return (
        <>
          {renderBlockStyle()}
          <h1 {...attributes} className={blockStylesClassName}>
            {children}
          </h1>
        </>
      )
    case BlockType.Heading2:
      return (
        <>
          {renderBlockStyle()}
          <h2 {...attributes} className={blockStylesClassName}>
            {children}
          </h2>
        </>
      )
    case BlockType.Heading3:
      return (
        <>
          {renderBlockStyle()}
          <h3 {...attributes} className={blockStylesClassName}>
            {children}
          </h3>
        </>
      )
    case BlockType.Heading4:
      return (
        <>
          {renderBlockStyle()}
          <h4 {...attributes} className={blockStylesClassName}>
            {children}
          </h4>
        </>
      )
    case BlockType.Heading5:
      return (
        <>
          {renderBlockStyle()}
          <h5 {...attributes} className={blockStylesClassName}>
            {children}
          </h5>
        </>
      )
    case BlockType.Heading6:
      return (
        <>
          {renderBlockStyle()}
          <h6 {...attributes} className={blockStylesClassName}>
            {children}
          </h6>
        </>
      )
    case BlockType.BlockQuote:
      return (
        <>
          {renderBlockStyle()}
          {renderQuoteStyle()}
          <blockquote {...attributes} className={clsx(blockStylesClassName, quoteStylesClassName)}>
            {children}
          </blockquote>
        </>
      )
    case BlockType.OrderedList:
      return (
        <>
          {renderBlockStyle()}
          <ol {...attributes} className={blockStylesClassName} style={{ listStylePosition: 'inside' }}>
            {children}
          </ol>
        </>
      )
    case BlockType.UnorderedList:
      return (
        <>
          {renderBlockStyle()}
          <ul {...attributes} className={blockStylesClassName} style={{ listStylePosition: 'inside' }}>
            {children}
          </ul>
        </>
      )
    case BlockType.ListItem:
      return (
        <>
          {renderBlockStyle()}
          <li {...attributes} className={blockStylesClassName}>
            {children}
          </li>
        </>
      )
    case BlockType.ListItemChild:
      return (
        <>
          {renderBlockStyle()}
          <span {...attributes} className={blockStylesClassName}>
            {children}
          </span>
        </>
      )
  }
}
