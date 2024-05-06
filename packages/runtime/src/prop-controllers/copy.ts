import { Descriptor } from './descriptors'
import { copy as backgroundsCopy } from './copy/backgrounds'
import {
  copyLinkPropControllerData,
  copyShadowsPropControllerData,
  copyBorderPropControllerData,
  copyGridPropControllerData,
  copyImagePropControllerData,
  copyImagesPropControllerData,
} from '@makeswift/prop-controllers'
import { copy as richTextCopy } from './copy/rich-text'
import { copy as elementIdCopy } from './copy/element-id'
import { CopyContext } from '../state/react-page'
import { Types as PropControllerTypes } from '@makeswift/prop-controllers'
import {
  copyResponsiveColorPropControllerData,
  copyTablePropControllerData,
  copyNavigationLinksPropControllerData,
} from '@makeswift/prop-controllers'
import { DELETED_PROP_CONTROLLER_TYPES } from './deleted'

// @note: note typing value, because would then have to type narrow `Data` per case
export function copy(descriptor: Descriptor, value: any, context: CopyContext) {
  switch (descriptor.type) {
    case 'Backgrounds':
      return backgroundsCopy(descriptor, value, context)
    case PropControllerTypes.Grid:
      return copyGridPropControllerData(value, context)
    case PropControllerTypes.NavigationLinks:
      return copyNavigationLinksPropControllerData(value, context)
    case PropControllerTypes.Link:
      return copyLinkPropControllerData(value, context)
    case 'Shadows':
      return copyShadowsPropControllerData(value, context)
    case PropControllerTypes.Image:
      return copyImagePropControllerData(value, context)
    case PropControllerTypes.Images:
      return copyImagesPropControllerData(value, context)
    case 'ResponsiveColor':
      return copyResponsiveColorPropControllerData(value, context)
    case PropControllerTypes.TableFormFields:
      return copyTablePropControllerData(value, context)
    case PropControllerTypes.Table:
      return copyTablePropControllerData(value, context)
    case PropControllerTypes.Border:
      return copyBorderPropControllerData(value, context)
    case DELETED_PROP_CONTROLLER_TYPES.RichText:
      return richTextCopy(value, context)
    case 'ElementID':
      return elementIdCopy(value, context)
    default:
      return value
  }
}

export function copyElementReference(value: string, context: CopyContext) {
  return context.replacementContext.globalElementIds.get(value) || value
}
