import {
  CheckboxControlData,
  CheckboxControlDefinition,
  CheckboxControlType,
  ColorControlData,
  ColorControlDefinition,
  ColorControlType,
  ComboboxControlData,
  ComboboxControlDefinition,
  ComboboxControlType,
  ControlDefinition,
  ControlDefinitionData,
  ImageControlData,
  ImageControlDefinition,
  ImageControlType,
  ListControlData,
  ListControlDefinition,
  ListControlType,
  NumberControlData,
  NumberControlDefinition,
  NumberControlType,
  SelectControlData,
  SelectControlDefinition,
  SelectControlType,
  ShapeControlData,
  ShapeControlDefinition,
  ShapeControlType,
  TextAreaControlData,
  TextAreaControlDefinition,
  TextAreaControlType,
  TextInputControlData,
  TextInputControlDefinition,
  TextInputControlType,
} from '../../../controls'
import { RenderHook } from '../components'
import { CheckboxControlValue, useCheckboxControlValue } from './checkbox'
import { ColorControlValue, useColorValue } from './color'
import { ComboboxControlValue, useComboboxControlValue } from './combobox'
import { ImageControlValue, useImageControlValue } from './image'
import { ListControlValue } from './list'
import { NumberControlValue, useNumber } from './number'
import { SelectControlValue, useSelectControlValue } from './select'
import { ShapeControlValue } from './shape'
import { TextAreaControlValue, useTextAreaValue } from './text-area'
import { TextInputControlValue, useTextInputValue } from './text-input'

export type ControlDefinitionValue<T extends ControlDefinition> =
  T extends CheckboxControlDefinition
    ? CheckboxControlValue<T>
    : T extends NumberControlDefinition
    ? NumberControlValue<T>
    : T extends TextInputControlDefinition
    ? TextInputControlValue<T>
    : T extends TextAreaControlDefinition
    ? TextAreaControlValue<T>
    : T extends SelectControlDefinition
    ? SelectControlValue<T>
    : T extends ColorControlDefinition
    ? ColorControlValue<T>
    : T extends ImageControlDefinition
    ? ImageControlValue
    : T extends ComboboxControlDefinition
    ? ComboboxControlValue<T>
    : T extends ShapeControlDefinition
    ? ShapeControlValue<T>
    : T extends ListControlDefinition
    ? ListControlValue<T>
    : never

type ControlValueProps<T extends ControlDefinition> = {
  definition: T
  data: ControlDefinitionData<T> | undefined
  children(value: ControlDefinitionValue<T>): JSX.Element
}

export function ControlValue<T extends ControlDefinition>({
  data,
  definition,
  children,
}: ControlValueProps<T>): JSX.Element {
  switch (definition.type) {
    case CheckboxControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useCheckboxControlValue}
          parameters={[data as CheckboxControlData, definition]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case NumberControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useNumber}
          parameters={[data as NumberControlData, definition]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case TextInputControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useTextInputValue}
          parameters={[data as TextInputControlData, definition]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case TextAreaControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useTextAreaValue}
          parameters={[data as TextAreaControlData, definition]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case SelectControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useSelectControlValue}
          parameters={[data as SelectControlData, definition]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case ColorControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useColorValue}
          parameters={[data as ColorControlData, definition]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case ImageControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useImageControlValue}
          parameters={[data as ImageControlData]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case ComboboxControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useComboboxControlValue}
          parameters={[data as ComboboxControlData]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case ShapeControlType:
      return (
        <ShapeControlValue definition={definition} data={data as ShapeControlData}>
          {value => children(value as ControlDefinitionValue<T>)}
        </ShapeControlValue>
      )

    case ListControlType:
      return (
        <ListControlValue definition={definition} data={data as ListControlData}>
          {value => children(value as ControlDefinitionValue<T>)}
        </ListControlValue>
      )

    default:
      return children(data as ControlDefinitionValue<T>)
  }
}
