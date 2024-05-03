import { NodeJSON, InlineJSON, MarkJSON, RichTextValue } from '../../controls'
import { CopyContext } from '../../state/react-page'

export function copy(
  value: RichTextValue | undefined,
  context: CopyContext,
): RichTextValue | undefined {
  if (value == null) return value

  return { ...value, document: value.document ? copyNode(value.document) : value.document }

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
          data: inline.data ? copyLinkData(inline.data as any) : inline.data,
        }

      default:
        return { ...inline, nodes: inline.nodes?.map(copyNode) }
    }
  }

  function copyLinkData(data: any): any {
    switch (data.type) {
      case 'OPEN_PAGE': {
        const pageId = data.payload.pageId

        if (pageId == null) return data

        return {
          ...data,
          payload: {
            ...data.payload,
            pageId: context.replacementContext.pageIds.get(pageId) ?? data.payload.pageId,
          },
        }
      }

      case 'SCROLL_TO_ELEMENT': {
        const elementIdConfig = data.payload.elementIdConfig

        if (elementIdConfig == null) return data

        return {
          ...data,
          payload: {
            ...data.payload,
            elementIdConfig: {
              ...elementIdConfig,
              elementKey:
                context.replacementContext.elementKeys.get(elementIdConfig.elementKey) ??
                elementIdConfig.elementKey,
            },
          },
        }
      }

      default:
        return data
    }
  }

  function copyMark(mark: MarkJSON): MarkJSON {
    switch (mark.type) {
      case 'typography': {
        const typographyId = mark.data?.value.id

        return {
          ...mark,
          data: {
            ...mark.data,
            value: {
              ...mark.data?.value,
              id: context.replacementContext.typographyIds.get(typographyId) ?? typographyId,
              style: mark.data?.value.style.map((override: any) => ({
                ...override,
                value: {
                  ...override.value,
                  color:
                    override.value.color == null
                      ? override.value.color
                      : {
                          ...override.value.color,
                          swatchId:
                            context.replacementContext.swatchIds.get(
                              override.value.color?.swatchId,
                            ) ?? override.value.color?.swatchId,
                        },
                },
              })),
            },
          },
        }
      }

      default:
        return mark
    }
  }
}
