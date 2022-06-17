import { InlineJSON, MarkJSON, NodeJSON } from 'slate'
import {
  BackgroundsValue,
  BorderValue,
  Descriptor,
  ElementIDValue,
  GridValue,
  ImagesValue,
  ImageValue,
  LinkValue,
  NavigationLinksValue,
  ResponsiveColorValue,
  RichTextValue,
  ShadowsValue,
  TableValue,
  Types,
} from './descriptors'
import { Data, Element } from '../state/react-page'
import { ColorControlData, ColorControlType, ImageControlData, ImageControlType } from '../controls'

export function getElementChildren<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): Element[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.Grid:
      return (prop as GridValue).elements

    default:
      return []
  }
}

export function getElementId<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string | null {
  if (prop == null) return null

  switch (descriptor.type) {
    case Types.ElementID:
      return prop as ElementIDValue

    default:
      return null
  }
}

export function getElementSwatchIds<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.Backgrounds: {
      const value = prop as BackgroundsValue
      return (
        value
          ?.flatMap(override => override.value)
          .flatMap(backgroundItem => {
            switch (backgroundItem.type) {
              case 'color':
                return backgroundItem.payload?.swatchId == null
                  ? []
                  : [backgroundItem.payload.swatchId]

              case 'gradient':
                return backgroundItem.payload.stops.flatMap(stop =>
                  stop.color == null ? [] : stop.color.swatchId,
                )

              default:
                return []
            }
          }) ?? []
      )
    }

    case Types.Border: {
      const value = prop as BorderValue
      return (
        value
          ?.flatMap(override => override.value)
          .flatMap(borderValue => {
            return [
              borderValue.borderTop?.color?.swatchId,
              borderValue.borderRight?.color?.swatchId,
              borderValue.borderBottom?.color?.swatchId,
              borderValue.borderLeft?.color?.swatchId,
            ].filter((swatchId): swatchId is NonNullable<typeof swatchId> => swatchId != null)
          }) ?? []
      )
    }

    case Types.NavigationLinks: {
      const value = prop as NavigationLinksValue
      return (
        value?.flatMap(item => {
          switch (item.type) {
            case 'button':
            case 'dropdown':
              return [
                ...(item.payload.color
                  ?.map(override => override.value)
                  .map(color => color.swatchId) ?? []),
                ...(item.payload.textColor
                  ?.map(override => override.value)
                  .map(color => color.swatchId) ?? []),
              ]
          }
        }) ?? []
      )
    }

    case Types.ResponsiveColor: {
      const value = prop as ResponsiveColorValue
      return value?.map(override => override.value).map(color => color.swatchId) ?? []
    }

    case Types.Shadows: {
      const value = prop as ShadowsValue
      return (
        value
          ?.flatMap(override => override.value)
          .map(item => item.payload.color?.swatchId)
          .filter((swatchId): swatchId is NonNullable<typeof swatchId> => swatchId != null) ?? []
      )
    }

    case Types.RichText: {
      const value = prop as RichTextValue

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
        return (
          mark.data?.value?.style
            .map((override: any) => override.value)
            .flatMap((typographyStyle: any) => typographyStyle.color?.swatchId)
            .filter((swatchId: any) => swatchId != null) ?? []
        )
      }
    }

    case ColorControlType: {
      const value = prop as ColorControlData
      return value?.swatchId == null ? [] : [value.swatchId]
    }

    default:
      return []
  }
}

export function getFileIds<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.Backgrounds: {
      const value = prop as BackgroundsValue
      return (
        value
          ?.flatMap(override => override.value)
          .flatMap(backgroundItem => {
            switch (backgroundItem.type) {
              case 'image':
                return [backgroundItem.payload.imageId]

              default:
                return []
            }
          }) ?? []
      )
    }

    case Types.Image: {
      const value = prop as ImageValue
      return value == null ? [] : [value]
    }

    case Types.Images: {
      const value = prop as ImagesValue
      return value?.flatMap(item => (item.props.file == null ? [] : [item.props.file])) ?? []
    }

    case ImageControlType: {
      const value = prop as ImageControlData
      return value == null ? [] : [value]
    }

    default:
      return []
  }
}

export function getTypographyIds<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.RichText: {
      const value = prop as RichTextValue
      if (value == null || value.document == null) return []

      return getNodeTypographyIds(value.document)

      function getNodeTypographyIds(node: NodeJSON): string[] {
        switch (node.object) {
          case 'document':
          case 'block':
          case 'inline':
            return node.nodes?.flatMap(getNodeTypographyIds) ?? []

          case 'text':
            return node.marks?.flatMap(getMarkTypographyIds) ?? []

          default:
            return []
        }
      }

      function getMarkTypographyIds(mark: MarkJSON): string[] {
        return [mark.data?.value?.id].filter(id => id != null)
      }
    }

    default:
      return []
  }
}

export function getTableIds<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.Table: {
      const value = prop as TableValue
      return value == null ? [] : [value]
    }

    default:
      return []
  }
}

export function getPageIds<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.Link: {
      const value = prop as LinkValue
      if (value == null) return []

      switch (value.type) {
        case 'OPEN_PAGE':
          return value.payload.pageId == null ? [] : [value.payload.pageId]

        default:
          return []
      }
    }

    case Types.NavigationLinks: {
      const value = prop as NavigationLinksValue
      if (value == null) return []

      return (
        value?.flatMap(item => {
          switch (item.type) {
            case 'button': {
              if (item.payload.link == null) return []

              switch (item.payload.link.type) {
                case 'OPEN_PAGE':
                  return item.payload.link.payload.pageId == null
                    ? []
                    : [item.payload.link.payload.pageId]

                default:
                  return []
              }
            }

            case 'dropdown': {
              return (
                item.payload.links?.flatMap(link => {
                  if (link.payload.link == null) return []

                  switch (link.payload.link.type) {
                    case 'OPEN_PAGE':
                      return link.payload.link.payload.pageId == null
                        ? []
                        : [link.payload.link.payload.pageId]

                    default:
                      return []
                  }
                }) ?? []
              )
            }
          }
        }) ?? []
      )
    }

    case Types.RichText: {
      const value = prop as RichTextValue
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

    default:
      return []
  }
}
