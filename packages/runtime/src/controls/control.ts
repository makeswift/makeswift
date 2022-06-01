import { CheckboxControlData, CheckboxControlDefinition } from './checkbox'
import { ColorControlData, ColorControlDefinition } from './color'
import { ComboboxControlData, ComboboxControlDefinition } from './combobox'
import { ImageControlData, ImageControlDefinition } from './image'
import { ListControlData, ListControlDefinition } from './list'
import { NumberControlData, NumberControlDefinition } from './number'
import { SelectControlData, SelectControlDefinition } from './select'
import { ShapeControlData, ShapeControlDefinition } from './shape'
import { TextAreaControlData, TextAreaControlDefinition } from './text-area'
import { TextInputControlData, TextInputControlDefinition } from './text-input'

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
  : never
