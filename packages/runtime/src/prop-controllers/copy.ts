import { Descriptor } from './descriptors'
import { copy as backgroundsCopy } from './copy/backgrounds'
import { copy as gridCopy } from './copy/grid'
import { copy as navigationLinksCopy } from './copy/navigation-links'
import { copy as linkCopy } from './copy/link'
import { copy as shadowsCopy } from './copy/shadows'
import { copy as imageCopy } from './copy/image'
import { copy as responsiveColorCopy } from './copy/responsive-color'
import { copy as tableFormFieldsCopy } from './copy/table-form-fields'
import { CopyContext } from '../state/react-page'

// @note: note typing value, because would then have to type narrow `Data` per case
export function copy(descriptor: Descriptor, value: any, context: CopyContext) {
  switch (descriptor.type) {
    case 'Backgrounds':
      return backgroundsCopy(value, context)
    case 'Grid':
      return gridCopy(value, context)
    case 'NavigationLinks':
      return navigationLinksCopy(value, context)
    case 'Link':
      return linkCopy(value, context)
    case 'Shadows':
      return shadowsCopy(value, context)
    case 'Image':
      return imageCopy(value, context)
    case 'ResponsiveColor':
      return responsiveColorCopy(value, context)
    case 'TableFormFields':
      return tableFormFieldsCopy(value, context)
    default:
      return value
  }
}
