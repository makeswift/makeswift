import {
  copyRichTextData,
  type CopyContext,
  type Data,
  type MergeContext,
} from '@makeswift/controls'

import { Types as PropControllerTypes } from '@makeswift/prop-controllers'

import { Descriptor, isLegacyDescriptor } from '../prop-controllers/descriptors'
import { copy as propControllerCopy } from '../prop-controllers/copy'
import { DELETED_PROP_CONTROLLER_TYPES } from '../prop-controllers/deleted'

export function copy(definition: Descriptor, value: any, context: CopyContext) {
  if (!isLegacyDescriptor(definition)) {
    return definition.copyData(value, context)
  }

  switch (definition.type) {
    case PropControllerTypes.Backgrounds:
    case PropControllerTypes.Grid:
    case PropControllerTypes.NavigationLinks:
    case PropControllerTypes.Link:
    case PropControllerTypes.Shadows:
    case PropControllerTypes.Image:
    case PropControllerTypes.Images:
    case PropControllerTypes.ResponsiveColor:
    case PropControllerTypes.TableFormFields:
    case PropControllerTypes.Table:
    case PropControllerTypes.Border:
    case PropControllerTypes.ElementID:
      return propControllerCopy(definition, value, context)

    case DELETED_PROP_CONTROLLER_TYPES.RichText:
      return copyRichTextData(value, context)

    default:
      return value
  }
}

export function merge(definition: Descriptor, a: Data, b: Data = a, context: MergeContext): Data {
  if (!isLegacyDescriptor(definition)) {
    return definition.mergeData(a, b, context)
  }

  switch (definition.type) {
    default:
      return b
  }
}

export function getTranslatableData(definition: Descriptor, data: Data): Data {
  if (!isLegacyDescriptor(definition)) {
    return definition.getTranslatableData(data)
  }

  switch (definition.type) {
    case PropControllerTypes.TextInput:
    case PropControllerTypes.TextArea:
      return data

    default:
      return null
  }
}
