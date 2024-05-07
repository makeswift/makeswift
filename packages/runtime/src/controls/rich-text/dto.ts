import { Descendant, Text, Selection } from 'slate'
import { LinkControlData } from '@makeswift/controls'
import {
  BlockJSON,
  InlineJSON,
  NodeJSON,
  SelectionJSON,
  TextJSON,
  RichTextDTO,
  ObjectType,
} from './dto-types'
import { Inline, InlineType, RichTextDAO, BlockType } from '../../slate/types'

// reimplemented from slate source for code splitting
function isText(node: any): node is Text {
  if (typeof node === 'object' && 'text' in node) return true

  return false
}

function toTextDAO(node: TextJSON): Text[] {
  const typographyMark = node.marks?.find(mark => mark.type === 'typography')

  return [
    {
      text: node.text ?? '',
      typography: typographyMark?.data?.value ?? undefined,
    },
  ]
}

function toInlineDAO(node: InlineJSON): Inline[] {
  switch (node.type) {
    case InlineType.Link:
      return [
        {
          children: node.nodes?.flatMap(toInlineOrTextDAO) ?? [],
          [node.type]: node.data as LinkControlData,
          type: node.type,
        },
      ]
    case InlineType.Code:
    case InlineType.SubScript:
    case InlineType.SuperScript:
      return [
        {
          children: node.nodes?.flatMap(toInlineOrTextDAO) ?? [],
          type: node.type,
        },
      ]
    default:
      return []
  }
}

function toInlineOrTextDAO(node: InlineJSON | TextJSON): Array<Inline | Text> {
  switch (node.object) {
    case ObjectType.Inline:
      return toInlineDAO(node)
    case ObjectType.Text:
      return toTextDAO(node)
    default:
      return []
  }
}

function toNodeDAO(node: NodeJSON): Descendant[] {
  switch (node.object) {
    case ObjectType.Inline:
    case ObjectType.Text:
      return toInlineOrTextDAO(node)
    case ObjectType.Block:
      /**
       * Prior to 0.50.0 of slate `node.nodes` could be `undefined` or empty. In that situation nothing was rendered.
       * With 0.50.0 slate introduced an normalization that requires all blocks to contain a text node.
       */
      return [
        {
          type: node.type,
          textAlign: node?.data && 'textAlign' in node.data ? node?.data.textAlign : undefined,
          children:
            node.nodes == null || (node.nodes && node.nodes.length === 0)
              ? [{ text: '' }]
              : node.nodes.flatMap(toNodeDAO),
        },
      ]
    default:
      return []
  }
}

export function richTextDTOtoSelection(data: RichTextDTO): Selection {
  if (
    data.selection?.anchor?.offset != null &&
    data.selection.anchor.path != null &&
    data.selection?.focus?.offset != null &&
    data.selection.focus.path != null
  )
    return {
      anchor: {
        offset: data.selection.anchor.offset,
        path: data.selection.anchor.path,
      },
      focus: {
        offset: data.selection.focus.offset,
        path: data.selection.focus.path,
      },
    }

  return null
}

export function richTextDTOtoDAO(data: RichTextDTO): RichTextDAO {
  return (
    data.document?.nodes?.flatMap(toNodeDAO) ?? [
      { type: BlockType.Default, children: [{ text: '' }] },
    ]
  )
}

function toInlineOrTextDTO(node: Inline | Text): Array<InlineJSON | TextJSON> {
  if (isText(node)) {
    return [
      {
        text: node.text,
        object: 'text',
        marks: node.typography
          ? [
              {
                data: {
                  value: node.typography,
                },
                type: 'typography',
                object: 'mark',
              },
            ]
          : [],
      },
    ]
  }
  switch (node.type) {
    case InlineType.Link:
      return [
        {
          object: ObjectType.Inline,
          nodes: node.children.flatMap(toInlineOrTextDTO),
          type: node.type,
          data: node.link ?? undefined,
        },
      ]
    case InlineType.Code:
    case InlineType.SubScript:
    case InlineType.SuperScript:
      return [
        {
          object: 'inline',
          nodes: node.children.flatMap(toInlineOrTextDTO),
          type: node.type,
          data: {},
        },
      ]
  }
}

function toNodeDTO(node: Descendant): Array<BlockJSON | InlineJSON | TextJSON> {
  if (isText(node)) return toInlineOrTextDTO(node)

  switch (node.type) {
    case InlineType.Link:
    case InlineType.Code:
    case InlineType.SubScript:
    case InlineType.SuperScript:
      return toInlineOrTextDTO(node)
    case BlockType.Heading1:
    case BlockType.Heading2:
    case BlockType.Heading3:
    case BlockType.Heading4:
    case BlockType.Heading5:
    case BlockType.Heading6:
    case BlockType.Default:
    case BlockType.BlockQuote:
    case BlockType.Paragraph:
    case BlockType.OrderedList:
    case BlockType.UnorderedList:
    case BlockType.ListItem:
    case BlockType.ListItemChild:
      return [
        {
          type: node.type,
          data: node.textAlign
            ? {
                textAlign: node.textAlign,
              }
            : {},
          object: 'block',
          nodes: node.children?.flatMap(toNodeDTO) ?? [],
        },
      ]
    default:
      return []
  }
}

export function toSelectionDTO(selection: Selection | null): SelectionJSON | undefined {
  if (selection == null) return undefined

  return {
    isFocused: false,
    marks: undefined,
    object: 'selection',
    anchor: {
      offset: selection.anchor.offset,
      path: selection.anchor.path,
      object: 'point',
    },
    focus: {
      offset: selection.focus.offset,
      path: selection.focus.path,
      object: 'point',
    },
  }
}

export function richTextDAOToDTO(children: Descendant[], selection: Selection): RichTextDTO {
  return {
    document: {
      data: undefined,
      nodes: children.flatMap(toNodeDTO),
      object: 'document',
    },
    object: 'value',
    selection: toSelectionDTO(selection),
    annotations: undefined,
    data: undefined,
  }
}
