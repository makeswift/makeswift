import { type Descriptor, isLegacyDescriptor } from './descriptors'
import {
  introspectRichTextData,
  Targets,
  type Data,
  type Element,
  type RichTextValue,
} from '@makeswift/controls'

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
  getElementIDPropControllerDataElementID,
  ElementIDPropControllerData,
  getGridPropControllerElementChildren,
  GridPropControllerData,
  getImagePropControllerFileIds,
  ImagePropControllerData,
  getImagesPropControllerFileIds,
  ImagesPropControllerData,
  getBackgroundsPropControllerFileIds,
  getBackgroundsPropControllerSwatchIds,
  BackgroundsPropControllerData,
} from '@makeswift/prop-controllers'

import { DELETED_PROP_CONTROLLER_TYPES } from './deleted'

export function getElementChildren<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): Element[] {
  if (prop == null) return []

  if (!isLegacyDescriptor(descriptor)) {
    return descriptor.introspect(prop, Targets.ChildrenElement)
  }

  switch (descriptor.type) {
    case PropControllerTypes.Grid:
      return getGridPropControllerElementChildren(prop as GridPropControllerData | undefined)

    default:
      return []
  }
}

export function getElementId<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string | null {
  if (prop == null) return null

  if (!isLegacyDescriptor(descriptor)) {
    return null
  }

  switch (descriptor.type) {
    case PropControllerTypes.ElementID:
      return getElementIDPropControllerDataElementID(prop as ElementIDPropControllerData) ?? null

    default:
      return null
  }
}

export function getSwatchIds<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string[] {
  if (prop == null) return []

  if (!isLegacyDescriptor(descriptor)) {
    return descriptor.introspect(prop, Targets.Swatch)
  }

  switch (descriptor.type) {
    case PropControllerTypes.Backgrounds:
      return getBackgroundsPropControllerSwatchIds(prop as BackgroundsPropControllerData)

    case PropControllerTypes.Border:
      return getBorderPropControllerDataSwatchIds(prop as BorderPropControllerData)

    case PropControllerTypes.NavigationLinks: {
      return getNavigationLinksPropControllerSwatchIds(prop as NavigationLinksPropControllerData)
    }

    case PropControllerTypes.ResponsiveColor:
      return getResponsiveColorPropControllerDataSawtchIds(prop as ResponsiveColorData)

    case PropControllerTypes.Shadows:
      return getShadowsPropControllerDataSwatchIds(prop as ShadowsPropControllerData)

    case DELETED_PROP_CONTROLLER_TYPES.RichText: {
      return introspectRichTextData(prop as RichTextValue, Targets.Swatch)
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

  if (!isLegacyDescriptor(descriptor)) {
    return descriptor.introspect(prop, Targets.File)
  }

  switch (descriptor.type) {
    case PropControllerTypes.Backgrounds:
      return getBackgroundsPropControllerFileIds(prop as BackgroundsPropControllerData)

    case PropControllerTypes.Image: {
      return getImagePropControllerFileIds(prop as ImagePropControllerData)
    }

    case PropControllerTypes.Images: {
      return getImagesPropControllerFileIds(prop as ImagesPropControllerData)
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

  if (!isLegacyDescriptor(descriptor)) {
    return descriptor.introspect(prop, Targets.Typography)
  }

  switch (descriptor.type) {
    case DELETED_PROP_CONTROLLER_TYPES.RichText: {
      return introspectRichTextData(prop as RichTextValue, Targets.Typography)
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

  if (!isLegacyDescriptor(descriptor)) {
    return descriptor.introspect(prop, Targets.Table)
  }

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

  if (!isLegacyDescriptor(descriptor)) {
    return descriptor.introspect(prop, Targets.Page)
  }

  switch (descriptor.type) {
    case PropControllerTypes.Link: {
      return getLinkPropControllerPageIds(prop as LinkPropControllerData)
    }

    case PropControllerTypes.NavigationLinks: {
      return getNavigationLinksPropControllerPageIds(prop as NavigationLinksPropControllerData)
    }

    case DELETED_PROP_CONTROLLER_TYPES.RichText: {
      return introspectRichTextData(prop as RichTextValue, Targets.Page)
    }

    default:
      return []
  }
}
