import { type IntrospectionTarget } from '../../../introspection'
import { type DataType } from '../../associated-types'
import { GenericLink, LinkDefinition } from '../../link'
import { unstable_Typography } from '../../typography'

import { type RichTextDTO } from '../dto'
import {
  TextJSON,
  type InlineJSON,
  type MarkJSON,
  type NodeJSON,
} from '../dto/types'

export function introspectRichTextData<R>(
  data: RichTextDTO | undefined,
  target: IntrospectionTarget<R>,
): R[] {
  if (data == null || data.document == null) return []

  function introspectNode(node: NodeJSON): R[] {
    switch (node.object) {
      case 'document':
      case 'block':
        return node.nodes?.flatMap(introspectNode) ?? []

      case 'inline':
      case 'text':
        return introspectInlineOrTextNode(node)

      default:
        return []
    }
  }

  function introspectInlineOrTextNode(node: InlineJSON | TextJSON): R[] {
    switch (node.object) {
      case 'inline':
        return [
          ...introspectInlineNode(node),
          ...(node.nodes?.flatMap(introspectInlineOrTextNode) ?? []),
        ]

      case 'text':
        return node.marks?.flatMap(introspectMark) ?? []

      default:
        return []
    }
  }

  function introspectInlineNode(inline: InlineJSON): R[] {
    switch (inline.type) {
      case 'link': {
        return GenericLink().introspect(
          inline.data as DataType<LinkDefinition>,
          target,
        )
      }

      default:
        return []
    }
  }

  function introspectMark(mark: MarkJSON): R[] {
    const typographyResult = unstable_Typography().introspect(
      mark.data?.value,
      target,
    )

    return [...typographyResult]
  }

  return introspectNode(data.document)
}
