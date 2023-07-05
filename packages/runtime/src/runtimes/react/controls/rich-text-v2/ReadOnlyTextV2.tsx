import { ForwardedRef, forwardRef } from 'react'
import {
  RichTextV2ControlData,
  RichTextV2ControlDefinition,
  RichTextV2Plugin,
} from '../../../../controls'
import { useStyle } from '../../use-style'
import { Descendant, Element, Text } from 'slate'
import { InlineType, Block, BlockType } from '../../../../slate'
import { ControlValue } from '../control'
import { RenderElementProps, RenderLeafProps } from 'slate-react'

type Props = {
  text: RichTextV2ControlData
  definition: RichTextV2ControlDefinition | null
}

const ReadOnlyTextV2 = forwardRef(function ReadOnlyText(
  { text: { descendants }, definition }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const descendantsAsString = getText(descendants)

  return (
    <div ref={ref}>
      {descendantsAsString === '' ? (
        <Placeholder />
      ) : (
        <Descendants plugins={definition?.config.plugins ?? []} descendants={descendants} />
      )}
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

type LeafProps = {
  leaf: Text
  plugins: RichTextV2Plugin[]
}

export function LeafComponent({ plugins, ...props }: LeafProps) {
  function initialRenderLeaf({ leaf }: RenderLeafProps) {
    return <span className={leaf.className}>{leaf.text === '' ? '\uFEFF' : leaf.text}</span>
  }

  const renderLeaf = plugins.reduce(
    (renderFn, plugin) => (props: RenderLeafProps) => {
      const { control, renderLeaf } = plugin

      if (control?.definition == null || renderLeaf == null) return renderFn(props)

      if (control.getLeafValue == null) return renderLeaf(renderFn, undefined)(props)

      return (
        <ControlValue definition={control.definition} data={control.getLeafValue(props.leaf)}>
          {value => renderLeaf(renderFn, value)(props)}
        </ControlValue>
      )
    },
    initialRenderLeaf,
  )

  return renderLeaf({ attributes: {} as any, leaf: props.leaf, children: null, text: props.leaf })
}

type ElementProps = {
  descendant: Element
  plugins: RichTextV2Plugin[]
}

function ElementComponent({ plugins, ...props }: ElementProps) {
  function initialRenderElement(props: RenderElementProps) {
    return <Descendants descendants={props.element.children} plugins={plugins} />
  }

  const renderElement = plugins.reduce(
    (renderFn, plugin) => (props: RenderElementProps) => {
      const { control, renderElement } = plugin

      console.log({ props })
      if (control?.definition == null || renderElement == null) return renderFn(props)

      if (control.getElementValue == null) return renderElement(renderFn, undefined)(props)

      return (
        <ControlValue definition={control.definition} data={control.getElementValue(props.element)}>
          {value => renderElement(renderFn, value)(props)}
        </ControlValue>
      )
    },
    initialRenderElement,
  )

  return renderElement({ attributes: {} as any, children: null, element: props.descendant })
}

// reimplemented from slate source for code splitting
function isText(node: Descendant): node is Text {
  if (typeof node === 'object' && 'text' in node) return true

  return false
}

function Descendants({
  descendants,
  plugins,
}: {
  plugins: RichTextV2Plugin[]
  descendants: Descendant[]
}) {
  return (
    <>
      {descendants.map((descendant, index) => {
        console.log({ descendant })
        if (isText(descendant)) {
          return <LeafComponent key={index} plugins={plugins} leaf={descendant} />
        }

        return <ElementComponent key={index} descendant={descendant} plugins={plugins} />
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
    case BlockType.Heading4:
    case BlockType.Heading5:
    case BlockType.Heading6:
    case BlockType.BlockQuote:
    case BlockType.Paragraph:
    case BlockType.Default:
    case BlockType.Text:
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
    case BlockType.Heading4:
    case BlockType.Heading5:
    case BlockType.Heading6:
    case BlockType.BlockQuote:
    case BlockType.Paragraph:
    case BlockType.Default:
    case BlockType.Text:
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
