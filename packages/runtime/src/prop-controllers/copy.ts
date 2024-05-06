import { Descriptor } from './descriptors'
import { copy as backgroundsCopy } from './copy/backgrounds'
import {
  copyLinkPropControllerData,
  copyShadowsPropControllerData,
  copyBorderPropControllerData,
  copyGridPropControllerData,
} from '@makeswift/prop-controllers'
import { copy as imageCopy } from './copy/image'
import { copy as imagesCopy } from './copy/images'
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
    case 'Image':
      return imageCopy(descriptor, value, context)
    case 'Images':
      return imagesCopy(descriptor, value, context)
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
