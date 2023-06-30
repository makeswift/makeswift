import { RichTextControlData } from './rich-text'
import { InlineJSON, MarkJSON, NodeJSON } from './dto-types'
import { Typography } from '../../api'
import { isNonNullable } from '../../utils/isNonNullable'
import { LinkValue } from '../../prop-controllers'

export function getRichTextSwatchIds(value: RichTextControlData) {
  if (value == null || value.document == null) return []

  return getNodeSwatchIds(value.document)

  function getNodeSwatchIds(node: NodeJSON): string[] {
    switch (node.object) {
      case 'document':
      case 'block':
      case 'inline':
        return node.nodes?.flatMap(getNodeSwatchIds) ?? []

      case 'text':
        return node.marks?.flatMap(getMarkSwatchIds) ?? []

      default:
        return []
    }
  }

  function getTypographyStyleSwatchIds(style: Typography['style'] | null | undefined): string[] {
    return (
      style
        ?.map(override => override.value)
        .flatMap(typographyStyle => typographyStyle.color?.swatchId)
        .filter(isNonNullable) ?? []
    )
  }

  function getMarkSwatchIds(mark: MarkJSON): string[] {
    return getTypographyStyleSwatchIds(mark.data?.value?.style)
  }
}

export function getRichTextTypographyIds(value: RichTextControlData) {
  if (value == null || value.document == null) return []

  return getNodeSwatchIds(value.document)

  function getNodeSwatchIds(node: NodeJSON): string[] {
    switch (node.object) {
      case 'document':
      case 'block':
      case 'inline':
        return node.nodes?.flatMap(getNodeSwatchIds) ?? []

      case 'text':
        return node.marks?.flatMap(getMarkSwatchIds) ?? []

      default:
        return []
    }
  }

  function getMarkSwatchIds(mark: MarkJSON): string[] {
    return [mark.data?.value?.id].filter(isNonNullable)
  }
}

export function getRichTextPageIds(value: RichTextControlData) {
  if (value == null || value.document == null) return []

  return getNodePageIds(value.document)

  function getNodePageIds(node: NodeJSON): string[] {
    switch (node.object) {
      case 'document':
      case 'block':
        return node.nodes?.flatMap(getNodePageIds) ?? []
      case 'inline':
        return getInlinePageIds(node)
      default:
        return []
    }
  }

  function getInlinePageIds(inline: InlineJSON): string[] {
    switch (inline.type) {
      case 'link': {
        const nodePageIds = inline.nodes?.flatMap(getNodePageIds) ?? []
        const dataPageIds = inline.data ? getLinkDataPageIds(inline.data as LinkValue) : []

        return [...nodePageIds, ...dataPageIds]
      }

      default:
        return inline.nodes?.flatMap(getNodePageIds) ?? []
    }
  }

  function getLinkDataPageIds(link: LinkValue): string[] {
    switch (link.type) {
      case 'OPEN_PAGE':
        return link.payload.pageId == null ? [] : [link.payload.pageId]

      default:
        return []
    }
  }
}
