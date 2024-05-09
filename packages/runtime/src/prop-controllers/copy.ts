import { Descriptor } from './descriptors'
import {
  copyLinkPropControllerData,
  copyShadowsPropControllerData,
  copyBorderPropControllerData,
  copyElementIDPropControllerData,
  copyGridPropControllerData,
  copyImagePropControllerData,
  copyImagesPropControllerData,
  copyBackgroundsPropControllerData,
} from '@makeswift/prop-controllers'
import { CopyContext } from '../state/react-page'
import { Types as PropControllerTypes } from '@makeswift/prop-controllers'
import {
  copyResponsiveColorPropControllerData,
  copyTablePropControllerData,
  copyNavigationLinksPropControllerData,
} from '@makeswift/prop-controllers'

// @note: note typing value, because would then have to type narrow `Data` per case
export function copy(descriptor: Descriptor, value: any, context: CopyContext) {
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
    default:
      return value
  }
}

export function copyElementReference(value: string, context: CopyContext) {
  return context.replacementContext.globalElementIds.get(value) || value
}
