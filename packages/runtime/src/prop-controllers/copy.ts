import { type CopyContext } from '@makeswift/controls'

import {
  copyLinkPropControllerData,
  copyShadowsPropControllerData,
  copyBorderPropControllerData,
  copyElementIDPropControllerData,
  copyGridPropControllerData,
  copyImagePropControllerData,
  copyImagesPropControllerData,
  copyBackgroundsPropControllerData,
  copyResponsiveColorPropControllerData,
  copyTablePropControllerData,
  copyNavigationLinksPropControllerData,
  Types as PropControllerTypes,
} from '@makeswift/prop-controllers'

import { isLegacyDescriptor, type Descriptor } from './descriptors'

// @note: note typing value, because would then have to type narrow `Data` per case
export function copy(descriptor: Descriptor, value: any, context: CopyContext) {
  if (!isLegacyDescriptor(descriptor)) {
    return descriptor.copyData(value, context)
  }

  switch (descriptor.type) {
    case PropControllerTypes.Backgrounds:
      return copyBackgroundsPropControllerData(descriptor, value, context)

    case PropControllerTypes.Grid:
      return copyGridPropControllerData(value, context)

    case PropControllerTypes.NavigationLinks:
      return copyNavigationLinksPropControllerData(value, context)

    case PropControllerTypes.Link:
      return copyLinkPropControllerData(value, context)

    case PropControllerTypes.Shadows:
      return copyShadowsPropControllerData(value, context)

    case PropControllerTypes.Image:
      return copyImagePropControllerData(value, context)

    case PropControllerTypes.Images:
      return copyImagesPropControllerData(value, context)

    case PropControllerTypes.ResponsiveColor:
      return copyResponsiveColorPropControllerData(value, context)

    case PropControllerTypes.TableFormFields:
      return copyTablePropControllerData(value, context)

    case PropControllerTypes.Table:
      return copyTablePropControllerData(value, context)

    case PropControllerTypes.Border:
      return copyBorderPropControllerData(value, context)

    case PropControllerTypes.ElementID:
      return copyElementIDPropControllerData(value, context)

    // FIXME: DELETED_PROP_CONTROLLER_TYPES.RichText ??

    default:
      return value
  }
}

export function copyElementReference(value: string, context: CopyContext) {
  return context.replacementContext.globalElementIds.get(value) || value
}
