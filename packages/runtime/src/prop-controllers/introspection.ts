import {
  BackgroundsValue,
  Descriptor,
  ElementIDValue,
  getListPropControllerElementChildren,
  getListPropControllerFileIds,
  getListPropControllerPageIds,
  getListPropControllerSwatchIds,
  getListPropControllerTypographyIds,
  getShapePropControllerElementChildren,
  getShapePropControllerFileIds,
  getShapePropControllerPageIds,
  getShapePropControllerSwatchIds,
  getShapePropControllerTypographyIds,
  GridValue,
  ImagesValue,
  ImageValue,
  ListValue,
  RichTextValue,
  ShapeValue,
  Types,
} from './descriptors'
import { Data, Element } from '../state/react-page'
import {
  ColorControlData,
  ColorControlType,
  getListElementChildren,
  getListFileIds,
  getListPageIds,
  getListSwatchIds,
  getListTypographyIds,
  getShapeElementChildren,
  getShapeFileIds,
  getShapePageIds,
  getShapeSwatchIds,
  getShapeTypographyIds,
  getTypographySwatchIds,
  getTypographyTypographyIds,
  ImageControlData,
  ImageControlType,
  LinkControlData,
  LinkControlType,
  ListControlData,
  ListControlType,
  RichTextControlData,
  RichTextControlType,
  ShapeControlData,
  ShapeControlType,
  SlotControlData,
  SlotControlType,
  StyleV2ControlData,
  StyleV2ControlType,
  TypographyControlData,
  TypographyControlType,
} from '../controls'
import {
  getRichTextPageIds,
  getRichTextSwatchIds,
  getRichTextTypographyIds,
} from '../controls/rich-text/introspection'
import {
  getRichTextV2PageIds,
  getRichTextV2SwatchIds,
  getRichTextV2TypographyIds,
} from '../controls/rich-text-v2/introspection'
import {
  RichTextV2ControlType,
  RichTextV2ControlData,
  isRichTextV1Data,
} from '../controls/rich-text-v2/rich-text-v2'
import { match, P } from 'ts-pattern'
import {
  getLinkPropControllerPageIds,
  getResponsiveColorPropControllerDataSawtchIds,
  getShadowsPropControllerDataSwatchIds,
  LinkPropControllerData,
  Types as PropControllerTypes,
  ResponsiveColorData,
  ShadowsPropControllerData,
  getBorderPropControllerDataSwatchIds,
  TablePropControllerData,
  getTablePropControllerDataTableIds,
  getNavigationLinksPropControllerPageIds,
  NavigationLinksPropControllerData,
  getNavigationLinksPropControllerSwatchIds,
  BorderPropControllerData,
} from '@makeswift/prop-controllers'

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
      return getShapeElementChildren(descriptor, prop as ShapeControlData)
    }

    case ListControlType: {
      return getListElementChildren(descriptor, prop as ListControlData)
    }

    case Types.Shape: {
      return getShapePropControllerElementChildren(descriptor, prop as ShapeValue)
    }

    case Types.List: {
      return getListPropControllerElementChildren(descriptor, prop as ListValue)
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

export function getSwatchIds<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string[] {
  if (prop == null) return []
  switch (descriptor.type) {
    case Types.Backgrounds:
      return getBackgroundsSwatchIds(prop as BackgroundsValue)

    case PropControllerTypes.Border:
      return getBorderPropControllerDataSwatchIds(prop as BorderPropControllerData)

    case PropControllerTypes.NavigationLinks: {
      return getNavigationLinksPropControllerSwatchIds(prop as NavigationLinksPropControllerData)
    }

    case PropControllerTypes.ResponsiveColor:
      return getResponsiveColorPropControllerDataSawtchIds(prop as ResponsiveColorData)

    case PropControllerTypes.Shadows:
      return getShadowsPropControllerDataSwatchIds(prop as ShadowsPropControllerData)

    case RichTextControlType:
    case Types.RichText: {
      return getRichTextSwatchIds(prop as RichTextValue)
    }

    case ColorControlType: {
      const value = prop as ColorControlData
      return value?.swatchId == null ? [] : [value.swatchId]
    }

    case TypographyControlType: {
      return getTypographySwatchIds(prop as TypographyControlData[number])
    }

    case StyleV2ControlType: {
      const value = prop as StyleV2ControlData

      return value?.flatMap(value => getSwatchIds(descriptor.config.type, value.value)) ?? []
    }

    case RichTextV2ControlType: {
      const data = prop as RichTextV2ControlData | RichTextControlData

      if (isRichTextV1Data(data)) return getRichTextSwatchIds(data)

      return getRichTextV2SwatchIds(descriptor, data)
    }

    case ShapeControlType: {
      return getShapeSwatchIds(descriptor, prop as ShapeControlData)
    }

    case ListControlType: {
      return getListSwatchIds(descriptor, prop as ListControlData)
    }

    case Types.Shape: {
      return getShapePropControllerSwatchIds(descriptor, prop as ShapeValue)
    }

    case Types.List: {
      return getListPropControllerSwatchIds(descriptor, prop as ListValue)
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
        return match(backgroundItem)
          .with({ type: 'image-v1', payload: { image: { type: 'makeswift-file' } } }, item => [
            item.payload.image.id,
          ])
          .with({ type: 'image', payload: { imageId: P.string } }, item => [item.payload.imageId])
          .otherwise(() => [])
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
      return match(prop as ImageValue)
        .with(P.string, v => [v])
        .with({ type: 'makeswift-file', version: 1 }, v => [v.id])
        .with({ type: 'external-file', version: 1 }, () => [])
        .exhaustive()
    }

    case Types.Images: {
      const value = prop as ImagesValue
      return (
        value?.flatMap(item =>
          match(item.props.file)
            .with(P.string, f => [f])
            .with({ type: 'makeswift-file', version: 1 }, f => [f.id])
            .with({ type: 'external-file', version: 1 }, () => [])
            .with(P.nullish, () => [])
            .otherwise(() => []),
        ) ?? []
      )
    }

    case ImageControlType: {
      const value = prop as ImageControlData
      return match(value)
        .with(P.string, f => [f])
        .with({ type: 'makeswift-file' }, f => [f.id])
        .with({ type: 'external-file' }, () => [])
        .otherwise(() => [])
    }

    case ShapeControlType: {
      return getShapeFileIds(descriptor, prop as ShapeControlData)
    }

    case ListControlType: {
      return getListFileIds(descriptor, prop as ListControlData)
    }

    case Types.Shape: {
      return getShapePropControllerFileIds(descriptor, prop as ShapeValue)
    }

    case Types.List: {
      return getListPropControllerFileIds(descriptor, prop as ListValue)
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
    case TypographyControlType: {
      return getTypographyTypographyIds(prop as TypographyControlData[number])
    }
    case RichTextControlType:
    case Types.RichText: {
      return getRichTextTypographyIds(prop as RichTextControlData)
    }

    case RichTextV2ControlType: {
      const data = prop as RichTextV2ControlData | RichTextControlData

      if (isRichTextV1Data(data)) return getRichTextTypographyIds(data)

      return getRichTextV2TypographyIds(descriptor, data)
    }

    case ShapeControlType: {
      return getShapeTypographyIds(descriptor, prop as ShapeControlData)
    }

    case ListControlType: {
      return getListTypographyIds(descriptor, prop as ListControlData)
    }

    case Types.Shape: {
      return getShapePropControllerTypographyIds(descriptor, prop as ShapeValue)
    }

    case Types.List: {
      return getListPropControllerTypographyIds(descriptor, prop as ListValue)
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
    case PropControllerTypes.Table: {
      return getTablePropControllerDataTableIds(prop as TablePropControllerData)
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
    case PropControllerTypes.Link: {
      return getLinkPropControllerPageIds(prop as LinkPropControllerData)
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

    case PropControllerTypes.NavigationLinks: {
      return getNavigationLinksPropControllerPageIds(prop as NavigationLinksPropControllerData)
    }

    case RichTextControlType:
    case Types.RichText: {
      return getRichTextPageIds(prop as RichTextControlData)
    }

    case RichTextV2ControlType: {
      const data = prop as RichTextV2ControlData | RichTextControlData

      if (isRichTextV1Data(data)) return getRichTextPageIds(data)

      return getRichTextV2PageIds(descriptor, data)
    }

    case ShapeControlType: {
      return getShapePageIds(descriptor, prop as ShapeControlData)
    }

    case ListControlType: {
      return getListPageIds(descriptor, prop as ListControlData)
    }

    case Types.Shape: {
      return getShapePropControllerPageIds(descriptor, prop as ShapeValue)
    }

    case Types.List: {
      return getListPropControllerPageIds(descriptor, prop as ListValue)
    }
    default:
      return []
  }
}
