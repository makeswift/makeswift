import { type CopyContext } from '../../../context'
import { GenericLink } from '../../link'
import { unstable_Typography } from '../../typography'

import { type RichTextDTO } from '../dto'
import { type InlineJSON, type MarkJSON, type NodeJSON } from '../dto/types'

export function copyRichTextData(
  value: RichTextDTO | undefined,
  context: CopyContext,
): RichTextDTO | undefined {
  if (value == null) return value

  return {
    ...value,
    document: value.document ? copyNode(value.document) : value.document,
  }

  function copyNode<T extends NodeJSON>(node: T): T {
    switch (node.object) {
      case 'document':
      case 'block':
      case 'inline':
        // @ts-expect-error: TypeScript can't refine the generic type T, even though it can
        // refine NodeJSON.
        return copyInline(node)

      case 'text':
        return { ...node, marks: node.marks?.map(copyMark) }

      default:
        return node
    }
  }

  function copyInline(inline: InlineJSON): InlineJSON {
    switch (inline.type) {
      case 'link':
        return {
          ...inline,
          nodes: inline.nodes?.map(copyNode),
          data: GenericLink().copyData(inline.data as any, context) as any,
        }

      default:
        return { ...inline, nodes: inline.nodes?.map(copyNode) }
    }
  }

  function copyMark(mark: MarkJSON): MarkJSON {
    switch (mark.type) {
      case 'typography': {
        return {
          ...mark,
          data: {
            ...mark.data,
            value: unstable_Typography().copyData(mark.data?.value, context),
          },
        }
      }

      default:
        return mark
    }
  }
}
