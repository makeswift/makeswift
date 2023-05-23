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
  LinkControlData,
  LinkControlDefinition,
  LinkControlType,
  ListControl,
  ListControlData,
  ListControlDefinition,
  ListControlType,
  NumberControlData,
  NumberControlDefinition,
  NumberControlType,
  RichTextControl,
  RichTextControlData,
  RichTextControlDefinition,
  RichTextControlType,
  RichTextV2Control,
  RichTextV2ControlData,
  RichTextV2ControlDefinition,
  RichTextV2ControlType,
  SelectControlData,
  SelectControlDefinition,
  SelectControlType,
  ShapeControl,
  ShapeControlData,
  ShapeControlDefinition,
  ShapeControlType,
  SlotControl,
  SlotControlData,
  SlotControlDefinition,
  SlotControlType,
  StyleControl,
  StyleControlData,
  StyleControlDefinition,
  StyleControlType,
  StyleV2ControlData,
  StyleV2ControlDefinition,
  StyleV2ControlType,
  TextAreaControlData,
  TextAreaControlDefinition,
  TextAreaControlType,
  TextInputControlData,
  TextInputControlDefinition,
  TextInputControlType,
} from '../../../controls'
import { AnyPropController } from '../../../prop-controllers/instances'
import { RenderHook } from '../components'
import { CheckboxControlValue, useCheckboxControlValue } from './checkbox'
import { ColorControlValue, useColorValue } from './color'
import { ComboboxControlValue, useComboboxControlValue } from './combobox'
import { ResolveImageControlValue, useImageControlValue } from './image'
import { LinkControlValue, useLinkControlValue } from './link'
import { ListControlValue } from './list'
import { NumberControlValue, useNumber } from './number'
import { RichTextControlValue, useRichText } from './rich-text'
import { RichTextV2ControlValue, useRichTextV2 } from './rich-text-v2'
import { SelectControlValue, useSelectControlValue } from './select'
import { ShapeControlValue } from './shape'
import { SlotControlValue, useSlot } from './slot'
import { StyleControlFormattedValue, useFormattedStyle } from './style'
import { StyleV2ControlFormattedValue, useFormattedStyleV2 } from './style-v2'
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
    ? ResolveImageControlValue<T>
    : T extends LinkControlDefinition
    ? LinkControlValue<T>
    : T extends ComboboxControlDefinition
    ? ComboboxControlValue<T>
    : T extends ShapeControlDefinition
    ? ShapeControlValue<T>
    : T extends ListControlDefinition
    ? ListControlValue<T>
    : T extends SlotControlDefinition
    ? SlotControlValue
    : T extends RichTextControlDefinition
    ? RichTextControlValue
    : T extends RichTextV2ControlDefinition
    ? RichTextV2ControlValue
    : T extends StyleControlDefinition
    ? StyleControlFormattedValue
    : T extends StyleV2ControlDefinition
    ? StyleV2ControlFormattedValue
    : never

type ControlValueProps<T extends ControlDefinition> = {
  definition: T
  data: ControlDefinitionData<T> | undefined
  children(value: ControlDefinitionValue<T>): JSX.Element
  control?: AnyPropController
}

export function ControlValue<T extends ControlDefinition>({
  data,
  definition,
  children,
  control,
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
          parameters={[data as ImageControlData, definition]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case LinkControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useLinkControlValue}
          parameters={[data as LinkControlData, definition]}
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
        <ShapeControlValue
          definition={definition}
          data={data as ShapeControlData}
          control={control as ShapeControl}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </ShapeControlValue>
      )

    case ListControlType:
      return (
        <ListControlValue
          definition={definition}
          data={data as ListControlData}
          control={control as ListControl}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </ListControlValue>
      )

    case SlotControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useSlot}
          parameters={[data as unknown as SlotControlData, control as SlotControl]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case RichTextControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useRichText}
          parameters={[data as unknown as RichTextControlData, control as RichTextControl]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case RichTextV2ControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useRichTextV2}
          parameters={[data as unknown as RichTextV2ControlData, control as RichTextV2Control]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case StyleControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useFormattedStyle}
          parameters={[data as unknown as StyleControlData, definition, control as StyleControl]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    case StyleV2ControlType:
      return (
        <RenderHook
          key={definition.type}
          hook={useFormattedStyleV2}
          parameters={[data as unknown as StyleV2ControlData, definition]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )

    default:
      return children(data as ControlDefinitionValue<T>)
  }
}
