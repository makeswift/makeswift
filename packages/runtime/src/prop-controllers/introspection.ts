import {
  BackgroundsValue,
  BorderValue,
  Descriptor,
  ElementIDValue,
  GridValue,
  ImagesValue,
  ImageValue,
  introspectListPropControllerData,
  introspectShapePropControllerData,
  LinkValue,
  ListValue,
  NavigationLinksValue,
  ResponsiveColorValue,
  RichTextValue,
  ShadowsValue,
  ShapeValue,
  TableValue,
  Types,
} from './descriptors'
import { Data, Element } from '../state/react-page'
import {
  ColorControlData,
  ColorControlType,
  ImageControlData,
  ImageControlType,
  InlineJSON,
  introspectListData,
  introspectShapeData,
  isRichTextV1Data,
  LinkControlData,
  LinkControlType,
  ListControlData,
  ListControlType,
  MarkJSON,
  NodeJSON,
  RichTextControlData,
  RichTextV2ControlData,
  RichTextV2ControlType,
  ShapeControlData,
  ShapeControlType,
  SlotControlData,
  SlotControlType,
  StyleV2ControlData,
  StyleV2ControlType,
} from '../controls'
import { Typography } from '../api'
import { isNonNullable } from '../components/utils/isNonNullable'
import { Descendant, Element as SlateElement, Text } from 'slate'

export function getElementChildren<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): Element[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.Grid:
      return (prop as GridValue).elements

    case SlotControlType:
      return (prop as SlotControlData).elements

    case ListControlType:
      return (prop as ListControlData).flatMap(({ value }) =>
        getElementChildren(descriptor.config.type, value),
      )

    case ShapeControlType: {
      return introspectShapeData(descriptor, prop as ShapeControlData, getElementChildren)
    }

    case ListControlType: {
      return introspectListData(descriptor, prop as ListControlData, getElementChildren)
    }

    case Types.Shape: {
      return introspectShapePropControllerData(descriptor, prop as ShapeValue, getElementChildren)
    }

    case Types.List: {
      return introspectListPropControllerData(descriptor, prop as ListValue, getElementChildren)
    }

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

export function getBackgroundsSwatchIds(value: BackgroundsValue | null | undefined): string[] {
  return (
    value
      ?.flatMap(override => override.value)
      .flatMap(backgroundItem => {
        switch (backgroundItem.type) {
          case 'color':
            return backgroundItem.payload?.swatchId == null ? [] : [backgroundItem.payload.swatchId]

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

export function getBorderSwatchIds(value: BorderValue | null | undefined): string[] {
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

export function getBoxShadowsSwatchIds(value: ShadowsValue | null | undefined): string[] {
  return (
    value
      ?.flatMap(override => override.value)
      .map(item => item.payload.color?.swatchId)
      .filter((swatchId): swatchId is NonNullable<typeof swatchId> => swatchId != null) ?? []
  )
}

export function getResponsiveColorSwatchIds(
  value: ResponsiveColorValue | null | undefined,
): string[] {
  return value?.map(override => override.value).map(color => color.swatchId) ?? []
}

export function getTypographyStyleSwatchIds(
  style: Typography['style'] | null | undefined,
): string[] {
  return (
    style
      ?.map(override => override.value)
      .flatMap(typographyStyle => typographyStyle.color?.swatchId)
      .filter(isNonNullable) ?? []
  )
}

export function getSwatchIds<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.Backgrounds:
      return getBackgroundsSwatchIds(prop as BackgroundsValue)

    case Types.Border:
      return getBorderSwatchIds(prop as BorderValue)

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

    case Types.ResponsiveColor:
      return getResponsiveColorSwatchIds(prop as ResponsiveColorValue)

    case Types.Shadows:
      return getBoxShadowsSwatchIds(prop as ShadowsValue)

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
        return getTypographyStyleSwatchIds(mark.data?.value?.style)
      }
    }

    case ColorControlType: {
      const value = prop as ColorControlData
      return value?.swatchId == null ? [] : [value.swatchId]
    }

    case StyleV2ControlType: {
      const value = prop as StyleV2ControlData

      return value?.flatMap(value => getSwatchIds(descriptor.config.type, value.value)) ?? []
    }

    case RichTextV2ControlType: {
      const data = prop as RichTextV2ControlData | RichTextControlData
      const plugins = descriptor.config.plugins

      // TODO:josh update RichTextV2 to introspect RichText data when it encounters it.
      if (isRichTextV1Data(data)) return []

      return data.descendants.flatMap(d => getDescendantSwatchIds(d))

      function getDescendantSwatchIds(descendant: Descendant): string[] {
        if (SlateElement.isElement(descendant)) {
          return [
            ...getSlateElementSwatchIds(descendant),
            ...descendant.children.flatMap(d => getDescendantSwatchIds(d)),
          ]
        }

        if (Text.isText(descendant)) {
          return getTextSwatchIds(descendant)
        }

        return []
      }

      function getSlateElementSwatchIds(descendant: SlateElement) {
        return (
          plugins?.flatMap(plugin =>
            plugin.control?.definition && plugin.control.getElementValue
              ? getSwatchIds(plugin.control.definition, plugin.control.getElementValue(descendant))
              : [],
          ) ?? []
        )
      }

      function getTextSwatchIds(text: Text) {
        return (
          plugins?.flatMap(plugin =>
            plugin.control?.definition && plugin.control.getLeafValue
              ? getSwatchIds(plugin.control.definition, plugin.control.getLeafValue(text))
              : [],
          ) ?? []
        )
      }
    }

    case ShapeControlType: {
      return introspectShapeData(descriptor, prop as ShapeControlData, getSwatchIds)
    }

    case ListControlType: {
      return introspectListData(descriptor, prop as ListControlData, getSwatchIds)
    }

    case Types.Shape: {
      return introspectShapePropControllerData(descriptor, prop as ShapeValue, getSwatchIds)
    }

    case Types.List: {
      return introspectListPropControllerData(descriptor, prop as ListValue, getSwatchIds)
    }

    default:
      return []
  }
}

export function getBackgroundsFileIds(value: BackgroundsValue | null | undefined): string[] {
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

export function getFileIds<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.Backgrounds:
      return getBackgroundsFileIds(prop as BackgroundsValue)

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
    case ShapeControlType: {
      return introspectShapeData(descriptor, prop as ShapeControlData, getFileIds)
    }

    case ListControlType: {
      return introspectListData(descriptor, prop as ListControlData, getFileIds)
    }

    case Types.Shape: {
      return introspectShapePropControllerData(descriptor, prop as ShapeValue, getFileIds)
    }

    case Types.List: {
      return introspectListPropControllerData(descriptor, prop as ListValue, getFileIds)
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
    case ShapeControlType: {
      return introspectShapeData(descriptor, prop as ShapeControlData, getTypographyIds)
    }

    case ListControlType: {
      return introspectListData(descriptor, prop as ListControlData, getTypographyIds)
    }

    case Types.Shape: {
      return introspectShapePropControllerData(descriptor, prop as ShapeValue, getTypographyIds)
    }

    case Types.List: {
      return introspectListPropControllerData(descriptor, prop as ListValue, getTypographyIds)
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

    case LinkControlType: {
      const value = prop as LinkControlData

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

    case ShapeControlType: {
      return introspectShapeData(descriptor, prop as ShapeControlData, getPageIds)
    }

    case ListControlType: {
      return introspectListData(descriptor, prop as ListControlData, getPageIds)
    }

    case Types.Shape: {
      return introspectShapePropControllerData(descriptor, prop as ShapeValue, getPageIds)
    }

    case Types.List: {
      return introspectListPropControllerData(descriptor, prop as ListValue, getPageIds)
    }
    default:
      return []
  }
}
