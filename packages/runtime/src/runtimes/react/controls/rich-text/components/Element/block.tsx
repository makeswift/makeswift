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
  const { className: blockStylesClassName, styleElement: blockStylesStyleElement } = useStyle({ margin: 0, ...responsiveBlockStyles })

  const quoteStyles = {
    padding: '0.5em 10px',
    fontSize: '1.25em',
    fontWeight: '300',
    borderLeft: '5px solid rgba(0, 0, 0, 0.1)'
  }
  const { className: quoteStylesClassName, styleElement: quoteStylesStyleElement } = useStyle(quoteStyles)

  switch (element.type) {
    case BlockType.Default:
    case BlockType.Paragraph:
      return (
        <>
          {blockStylesStyleElement}
          <p {...attributes} className={blockStylesClassName}>
            {children}
          </p>
        </>
      )
    case BlockType.Heading1:
      return (
        <>
          {blockStylesStyleElement}
          <h1 {...attributes} className={blockStylesClassName}>
            {children}
          </h1>
        </>
      )
    case BlockType.Heading2:
      return (
        <>
          {blockStylesStyleElement}
          <h2 {...attributes} className={blockStylesClassName}>
            {children}
          </h2>
        </>
      )
    case BlockType.Heading3:
      return (
        <>
          {blockStylesStyleElement}
          <h3 {...attributes} className={blockStylesClassName}>
            {children}
          </h3>
        </>
      )
    case BlockType.Heading4:
      return (
        <>
          {blockStylesStyleElement}
          <h4 {...attributes} className={blockStylesClassName}>
            {children}
          </h4>
        </>
      )
    case BlockType.Heading5:
      return (
        <>
          {blockStylesStyleElement}
          <h5 {...attributes} className={blockStylesClassName}>
            {children}
          </h5>
        </>
      )
    case BlockType.Heading6:
      return (
        <>
          {blockStylesStyleElement}
          <h6 {...attributes} className={blockStylesClassName}>
            {children}
          </h6>
        </>
      )
    case BlockType.BlockQuote:
      return (
        <>
          {blockStylesStyleElement}
          {quoteStylesStyleElement}
          <blockquote {...attributes} className={clsx(blockStylesClassName, quoteStylesClassName)}>
            {children}
          </blockquote>
        </>
      )
    case BlockType.OrderedList:
      return (
        <>
          {blockStylesStyleElement}
          <ol {...attributes} className={blockStylesClassName} style={{ listStylePosition: 'inside' }}>
            {children}
          </ol>
        </>
      )
    case BlockType.UnorderedList:
      return (
        <>
          {blockStylesStyleElement}
          <ul {...attributes} className={blockStylesClassName} style={{ listStylePosition: 'inside' }}>
            {children}
          </ul>
        </>
      )
    case BlockType.ListItem:
      return (
        <>
          {blockStylesStyleElement}
          <li {...attributes} className={blockStylesClassName}>
            {children}
          </li>
        </>
      )
    case BlockType.ListItemChild:
      return (
        <>
          {blockStylesStyleElement}
          <span {...attributes} className={blockStylesClassName}>
            {children}
          </span>
        </>
      )
  }
}
