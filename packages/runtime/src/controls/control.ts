import { CheckboxControlData, CheckboxControlDefinition } from './checkbox'
import { ColorControlData, ColorControlDefinition, ColorControlType, copyColorData } from './color'
import { ComboboxControlData, ComboboxControlDefinition } from './combobox'
import { ImageControlData, ImageControlDefinition, copyImageData, ImageControlType } from './image'
import { LinkControlData, LinkControlDefinition, copyLinkData, LinkControlType } from './link'
import { ListControlData, ListControlDefinition, copyListData, ListControlType } from './list'
import { NumberControlData, NumberControlDefinition } from './number'
import { SelectControlData, SelectControlDefinition } from './select'
import { ShapeControlData, ShapeControlDefinition, copyShapeData, ShapeControlType } from './shape'
import { TextAreaControlData, TextAreaControlDefinition } from './text-area'
import { TextInputControlData, TextInputControlDefinition } from './text-input'
import { copyStyleData, StyleControlType } from './style'
import { copySlotData, SlotControlType, SlotControlDefinition } from './slot'

import { Descriptor, Types } from '../prop-controllers/descriptors'
import { copy as propControllerCopy } from '../prop-controllers/copy'
import { CopyContext } from '../state/react-page'

export type ControlDefinition =
  | CheckboxControlDefinition
  | NumberControlDefinition
  | TextInputControlDefinition
  | TextAreaControlDefinition
  | SelectControlDefinition
  | ColorControlDefinition
  | ImageControlDefinition
  | ComboboxControlDefinition
  | ShapeControlDefinition
  | ListControlDefinition<any>
  | LinkControlDefinition
  | SlotControlDefinition

export type ControlDefinitionData<T extends ControlDefinition> = T extends CheckboxControlDefinition
  ? CheckboxControlData
  : T extends NumberControlDefinition
  ? NumberControlData
  : T extends TextInputControlDefinition
  ? TextInputControlData
  : T extends TextAreaControlDefinition
  ? TextAreaControlData
  : T extends SelectControlDefinition
  ? SelectControlData<T>
  : T extends ColorControlDefinition
  ? ColorControlData
  : T extends ImageControlDefinition
  ? ImageControlData
  : T extends ComboboxControlDefinition
  ? ComboboxControlData<T>
  : T extends ShapeControlDefinition
  ? ShapeControlData<T>
  : T extends ListControlDefinition
  ? ListControlData<T>
  : T extends LinkControlDefinition
  ? LinkControlData
  : never

export function copy(definition: Descriptor | ControlDefinition, value: any, context: CopyContext) {
  switch (definition.type) {
    case Types.Backgrounds:
    case Types.Grid:
    case Types.NavigationLinks:
    case Types.Link:
    case Types.Shadows:
    case Types.Image:
    case Types.Images:
    case Types.ResponsiveColor:
    case Types.TableFormFields:
    case Types.Table:
    case Types.Border:
    case Types.RichText:
    case Types.ElementID:
      return propControllerCopy(definition, value, context)
    case ColorControlType:
      return copyColorData(value, context)
    case ImageControlType:
      return copyImageData(value, context)
    case LinkControlType:
      return copyLinkData(value, context)
    case ShapeControlType:
      return copyShapeData(definition, value, context)
    case ListControlType:
      return copyListData(definition, value, context)
    case StyleControlType:
      return copyStyleData(value, context)
    case SlotControlType:
      return copySlotData(value, context)
    default:
      return value
  }
}
