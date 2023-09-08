import { Descendant, Element, Text } from 'slate'
import { Inline } from '../../slate'
import { ElementUtils } from '../../slate/utils/element'
import { CopyContext } from '../../state/react-page'
import { RichTextV2ControlData } from './rich-text-v2'
import { richTextV2DescendentsToData } from './dto'

export function copyRichTextV2Data(
  data: RichTextV2ControlData | undefined,
  context: CopyContext,
): RichTextV2ControlData | undefined {
  if (data == null) return data

  return richTextV2DescendentsToData(data.descendants?.flatMap(d => copyNode(d)))

  function copyNode(descendant: Descendant): Descendant {
    if (Element.isElement(descendant) && ElementUtils.isInline(descendant)) {
      return copyLinkData(descendant)
    }

    if (Text.isText(descendant)) {
      return copyTypographyData(descendant)
    }

    return { ...descendant, children: descendant.children.map(copyNode) }
  }

  function copyLinkData(descendant: Inline): Inline {
    if (descendant.type !== 'link') {
      return { ...descendant, children: descendant.children.map(copyNode) as (Inline | Text)[] }
    }

    if (descendant.link == null) return descendant

    switch (descendant.link.type) {
      case 'OPEN_PAGE': {
        const pageId = descendant.link.payload.pageId

        if (pageId == null) return descendant

        return {
          ...descendant,
          link: {
            ...descendant.link,
            payload: {
              ...descendant.link.payload,
              pageId:
                context.replacementContext.pageIds.get(pageId) ?? descendant.link.payload.pageId,
            },
          },
          children: descendant.children.map(copyNode) as (Inline | Text)[],
        }
      }

      case 'SCROLL_TO_ELEMENT': {
        const elementIdConfig = descendant.link.payload.elementIdConfig

        if (elementIdConfig == null) return descendant

        return {
          ...descendant,
          link: {
            ...descendant.link,
            payload: {
              ...descendant.link.payload,
              elementIdConfig: {
                ...elementIdConfig,
                elementKey:
                  context.replacementContext.elementKeys.get(elementIdConfig.elementKey) ??
                  elementIdConfig.elementKey,
              },
            },
          },
          children: descendant.children.map(copyNode) as (Inline | Text)[],
        }
      }

      default:
        return descendant
    }
  }

  function copyTypographyData(descendant: Text): Text {
    return {
      ...descendant,

      ...(descendant.typography == null
        ? {}
        : {
            typography: {
              id:
                context.replacementContext.typographyIds.get(descendant.typography?.id ?? '') ??
                descendant.typography?.id,
              style: descendant.typography?.style.map(override => ({
                ...override,
                value: {
                  ...override.value,
                  ...(override.value.color == null
                    ? {}
                    : {
                        color: {
                          ...override.value.color,
                          swatchId:
                            context.replacementContext.swatchIds.get(
                              override.value.color?.swatchId ?? '',
                            ) ?? override.value.color?.swatchId,
                        },
                      }),
                },
              })),
            },
          }),
    }
  }
}
