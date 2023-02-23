import { Descendant, Selection } from 'slate'
import { LinkControlData } from '../../../controls'
import { TextJSON, BlockJSON, NodeJSON, ValueJSON, InlineJSON } from '../../../old-slate-types'
import { RichTextValue } from '../../../prop-controllers'
import { BlockElementUnion, InlineElementUnion } from './element'
import { TextTypes, TextUnion } from './leaf'

const fromTextNode = (oldNode: TextJSON): TextUnion[] => {
  if (oldNode.text == null) return []

  const typographyMark = oldNode.marks?.find(mark => mark.type === TextTypes.Typography)
  if (typographyMark) {
    return [
      {
        text: oldNode.text,
        type: TextTypes.Typography,
        typography: typographyMark.data?.value,
      },
    ]
  }

  return [
    {
      type: 'unknown',
      text: oldNode.text,
    },
  ]
}

const fromInlineORTextJSON = (
  oldNode: InlineJSON | TextJSON,
): Array<InlineElementUnion | TextUnion> => {
  if (oldNode.object === 'inline') {
    switch (oldNode.type) {
      case TextTypes.Link:
        return [
          {
            children: oldNode.nodes?.flatMap(fromInlineORTextJSON) ?? [],
            [oldNode.type]: oldNode.data as LinkControlData,
            type: TextTypes.Link,
          },
        ]
      case TextTypes.Code:
        return [
          {
            children: oldNode.nodes?.flatMap(fromInlineORTextJSON) ?? [],
            type: TextTypes.Code,
          },
        ]
      case TextTypes.SubScript:
        return [
          {
            children: oldNode.nodes?.flatMap(fromInlineORTextJSON) ?? [],
            type: TextTypes.SubScript,
          },
        ]
      case TextTypes.SuperScript:
        return [
          {
            children: oldNode.nodes?.flatMap(fromInlineORTextJSON) ?? [],
            type: TextTypes.SuperScript,
          },
        ]
      default:
        break
    }
  }

  if (oldNode.object === 'text') {
    return fromTextNode(oldNode)
  }

  return []
}

const fromBlockJSON = (node: BlockJSON): BlockElementUnion[] => {
  return [
    {
      type: node.type as BlockElementUnion['type'],
      textAlign: node?.data && 'textAlign' in node.data ? node?.data.textAlign : undefined,
      children: node.nodes?.flatMap(fromNode) ?? [],
    },
  ]
}

const fromNode = (oldNode: NodeJSON): Descendant[] => {
  if (oldNode.object === 'text' || oldNode.object === 'inline') {
    return fromInlineORTextJSON(oldNode)
  } else if (oldNode.object === 'block') {
    return fromBlockJSON(oldNode)
  } else {
    return []
  }
}

export const fromJSON = (oldSchema: ValueJSON | RichTextValue): Descendant[] => {
  return oldSchema.document?.nodes?.flatMap(fromNode) ?? []
}

export const selectionFromJSON = (oldSchema: ValueJSON | RichTextValue): Selection => {
  if (
    oldSchema.selection?.anchor?.offset &&
    oldSchema.selection.anchor.path &&
    oldSchema.selection?.focus?.offset &&
    oldSchema.selection.focus.path
  )
    return {
      anchor: {
        offset: oldSchema.selection?.anchor?.offset,
        path: oldSchema.selection.anchor.path,
      },
      focus: {
        offset: oldSchema.selection?.focus?.offset,
        path: oldSchema.selection.focus.path,
      },
    }
  else {
    return {
      anchor: {
        offset: 0,
        path: [0, 0],
      },
      focus: {
        offset: 0,
        path: [0, 0],
      },
    }
  }
}

const toTextOrInlineNode = (
  oldNode: TextUnion | InlineElementUnion,
): Array<InlineJSON | TextJSON> => {
  if (oldNode.type === 'code' || oldNode.type === 'subscript' || oldNode.type === 'superscript') {
    return [
      {
        object: 'inline',
        nodes: oldNode.children.flatMap(toTextOrInlineNode),
        type: oldNode.type,
        data: {},
      },
    ]
  }

  if (oldNode.type === 'link') {
    return [
      {
        object: 'inline',
        nodes: oldNode.children.flatMap(toTextOrInlineNode),
        type: oldNode.type,
        data: oldNode.link,
      },
    ]
  }

  if (oldNode.type == 'typography')
    return [
      {
        object: 'text',
        text: oldNode.text,
        marks: [
          {
            data: {
              value: oldNode.typography,
            },
            type: 'typography',
            object: 'mark',
          },
        ],
      },
    ]

  return [
    {
      text: oldNode.text,
      object: 'text',
      marks: [],
    },
  ]
}

const toElementNode = (node: BlockElementUnion): BlockJSON[] => {
  const data = node.textAlign
    ? {
        textAlign: node.textAlign,
      }
    : {}

  return [
    {
      type: node.type,
      data,
      object: 'block',
      nodes: node.children?.flatMap(toNode) ?? [],
    },
  ]
}

const toNode = (oldNode: Descendant): Array<BlockJSON | InlineJSON | TextJSON> => {
  if (
    oldNode.type === 'typography' ||
    oldNode.type === 'unknown' ||
    oldNode.type === 'code' ||
    oldNode.type === 'subscript' ||
    oldNode.type === 'superscript' ||
    oldNode.type === 'link'
  ) {
    return toTextOrInlineNode(oldNode)
  } else {
    return toElementNode(oldNode)
  }
}

export const toJSON = (descendants: Descendant[], selection?: Selection): ValueJSON => {
  return {
    document: {
      nodes: descendants.flatMap(toNode),
    },
    object: 'value',
    selection: selection ?? undefined,
  }
}
