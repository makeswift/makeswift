import {
  ComboboxControlDefinition,
  ListControlDefinition,
  RichTextV2ControlDefinition,
  ShapeControlDefinition,
  StyleV2ControlDefinition,
} from '../../controls'
import {
  CheckboxDescriptor as CheckboxControl,
  CheckboxValue as CheckboxControlValue,
  Data,
  Device,
  DateDescriptor as DateControl,
  DateValue as DateControlValue,
  Gap,
  GapXDescriptor as GapXControl,
  GapXValue as GapXControlValue,
  GapYDescriptor as GapYControl,
  GapYValue as GapYControlValue,
  ImageDescriptor as ImageControl,
  ImageValue as ImageControlValue,
  LinkDescriptor as LinkControl,
  LinkValue as LinkControlValue,
  ListDescriptor as ListControl,
  ListOptions as ListControlConfig,
  ListValue as ListControlValue,
  NumberDescriptor as NumberControl,
  NumberValue as NumberControlValue,
  ResponsiveColorDescriptor as ResponsiveColorControl,
  ResponsiveColorValue as ResponsiveColorControlValue,
  ResponsiveNumberDescriptor as ResponsiveNumberControl,
  ResponsiveNumberValue as ResponsiveNumberControlValue,
  ResponsiveIconRadioGroupDescriptor as ResponsiveIconRadioGroupControl,
  ResponsiveIconRadioGroupValue as ResponsiveIconRadioGroupControlValue,
  ResponsiveSelectDescriptor as ResponsiveSelectControl,
  ResponsiveSelectValue as ResponsiveSelectControlValue,
  ResponsiveLengthDescriptor as ResponsiveLengthControl,
  ResponsiveLengthValue as ResponsiveLengthControlValue,
  RichTextDescriptor as RichTextControl,
  RichTextValue as RichTextControlValue,
  ShapeDescriptor as ShapeControl,
  ShapeValue as ShapeControlValue,
  TextInputDescriptor as TextInputControl,
  TextInputValue as TextInputControlValue,
  TextStyleDescriptor as TextStyleControl,
  TextStyleValue as TextStyleControlValue,
  TypeaheadDescriptor as TypeaheadControl,
  TypeaheadOptions as TypeaheadControlConfig,
  TypeaheadValue as TypeaheadControlValue,
  PanelDescriptorType as PanelControlType,
  PropControllerDescriptor as Control,
  Props as Controls,
} from '../../prop-controllers'
import {
  IconRadioGroupOption,
  LengthOption,
  SelectLabelOrientation,
  SelectOption,
  Length,
} from '../../prop-controllers/descriptors'
import { Deserialize, Serialize } from './controls/types'
import { DeserializedFunction, SerializedFunction } from './function-serialization'

export type SerializedPanelControl<T extends Data = Data> = Extract<
  SerializedControl<T>,
  { type: PanelControlType }
>

export type SerializedPanelControlValueType<T extends SerializedPanelControl> =
  T extends SerializedPanelControl<infer U> ? U : never

type SerializedShapeControlConfig<T extends Record<string, SerializedPanelControl>> = {
  type: T
  preset?: { [K in keyof T]?: SerializedPanelControlValueType<T[K]> }
}

export type SerializedShapeControl<
  _T extends Record<string, Data>,
  U extends Record<string, SerializedPanelControl>,
> = {
  type: typeof Controls.Types.Shape
  options: SerializedShapeControlConfig<U>
}

type SerializedListControlConfig<T extends Data> = {
  type: SerializedPanelControl<T>
  label?: string
  getItemLabel?: SerializedFunction<Exclude<ListControlConfig<T>['getItemLabel'], undefined>>
  preset?: ListControlValue<T>
  defaultValue?: ListControlValue<T>
}

export type SerializedListControl<T extends ListControlValue = ListControlValue> = {
  type: typeof Controls.Types.List
  options: SerializedListControlConfig<T extends ListControlValue<infer U> ? U : never>
}

type SerializedTypeaheadControlConfig<T extends Data> = {
  getItems: SerializedFunction<TypeaheadControlConfig<T>['getItems']>
  label?: string
  preset?: TypeaheadControlValue<T>
  defaultValue?: TypeaheadControlValue<T>
}

export type SerializedTypeaheadControl<T extends TypeaheadControlValue = TypeaheadControlValue> = {
  type: typeof Controls.Types.Typeahead
  options: SerializedTypeaheadControlConfig<T['value']>
}

type SerializedConfig<T> =
  | T
  | SerializedFunction<(props: Record<string, unknown>, deviceMode: Device) => T>

type GapXControlConfig = {
  preset?: GapXControlValue
  label?: string
  defaultValue?: Gap
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}

export type SerializedGapXControl<_T = GapXControlValue> = {
  type: typeof Controls.Types.GapX
  options: SerializedConfig<GapXControlConfig>
}

type GapYControlConfig = {
  preset?: GapYControlValue
  label?: string
  defaultValue?: Gap
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}

export type SerializedGapYControl<_T = GapYControlValue> = {
  type: typeof Controls.Types.GapY
  options: SerializedConfig<GapYControlConfig>
}

type ResponsiveNumberControlConfig = {
  preset?: ResponsiveNumberControlValue
  label?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}

export type SerializedResponsiveNumberControl<_T = ResponsiveNumberControlValue> = {
  type: typeof Controls.Types.ResponsiveNumber
  options: SerializedConfig<ResponsiveNumberControlConfig>
}

type CheckboxControlConfig = {
  preset?: CheckboxControlValue
  label: string
  hidden?: boolean
}

export type SerializedCheckboxControl<_T = CheckboxControlValue> = {
  type: typeof Controls.Types.Checkbox
  options: SerializedConfig<CheckboxControlConfig>
}

type ResponsiveColorControlConfig = { label?: string; placeholder?: string; hidden?: boolean }

export type SerializedResponsiveColorControl<_T = ResponsiveColorControlValue> = {
  type: typeof Controls.Types.ResponsiveColor
  options: SerializedConfig<ResponsiveColorControlConfig>
}

type NumberControlConfig = {
  preset?: NumberControlValue
  label?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  suffix?: string
  hidden?: boolean
}

export type SerializedNumberControl<_T = NumberControlValue> = {
  type: typeof Controls.Types.Number
  options: SerializedConfig<NumberControlConfig>
}

type ResponsiveIconRadioGroupControlConfig<T extends string = string, U extends T = T> = {
  label?: string
  options: IconRadioGroupOption<T>[]
  defaultValue?: U
  hidden?: boolean
}

export type SerializedResponsiveIconRadioGroupControl<_T = ResponsiveIconRadioGroupControlValue> = {
  type: typeof Controls.Types.ResponsiveIconRadioGroup
  options: SerializedConfig<ResponsiveIconRadioGroupControlConfig>
}

type ResponsiveSelectControlConfig<T extends string = string, U extends T = T> = {
  label?: string
  labelOrientation?: SelectLabelOrientation
  options: SelectOption<T>[]
  defaultValue?: U
  hidden?: boolean
}

export type SerializedResponsiveSelectControl<_T = ResponsiveSelectControlValue> = {
  type: typeof Controls.Types.ResponsiveSelect
  options: SerializedConfig<ResponsiveSelectControlConfig>
}

type ResponsiveLengthControlConfig = {
  label?: string
  options?: LengthOption[]
  defaultValue?: Length
  hidden?: boolean
}

export type SerializedResponsiveLengthControl<_T = ResponsiveLengthControlValue> = {
  type: typeof Controls.Types.ResponsiveLength
  options: SerializedConfig<ResponsiveLengthControlConfig>
}

type DateControlConfig = { preset?: DateControlValue }

export type SerializedDateControl<_T = DateControlValue> = {
  type: typeof Controls.Types.Date
  options: SerializedConfig<DateControlConfig>
}

type LinkControlConfig = {
  preset?: LinkControlValue
  label?: string
  defaultValue?: LinkControlValue
  options?: { value: LinkControlValue['type']; label: string }[]
  hidden?: boolean
}

export type SerializedLinkControl<_T = LinkControlValue> = {
  type: typeof Controls.Types.Link
  options: SerializedConfig<LinkControlConfig>
}

type TextInputControlConfig = { label?: string; placeholder?: string; hidden?: boolean }

export type SerializedTextInputControl<_T = TextInputControlValue> = {
  type: typeof Controls.Types.TextInput
  options: SerializedConfig<TextInputControlConfig>
}

type TextStyleControlConfig = {
  preset?: TextStyleControlValue
  label?: string
  hidden?: boolean
}

export type SerializedTextStyleControl<_T = TextStyleControlValue> = {
  type: typeof Controls.Types.TextStyle
  options: SerializedConfig<TextStyleControlConfig>
}

type ImageControlConfig = { label?: string; hidden?: boolean }

export type SerializedImageControl<_T = ImageControlValue> = {
  type: typeof Controls.Types.Image
  options: SerializedConfig<ImageControlConfig>
}

type RichTextControlConfig = { preset?: RichTextControlValue }

export type SerializedRichTextControl<_T = RichTextControlValue> = {
  type: typeof Controls.Types.RichText
  options: SerializedConfig<RichTextControlConfig>
}

export type SerializedControl<T extends Data = Data> =
  | Exclude<
      Control<T>,
      | ListControl<T extends ListControlValue ? T : ListControlValue>
      | ShapeControl<T extends ShapeControlValue ? T : ShapeControlValue, any>
      | TypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>
      | GapXControl<T>
      | GapYControl<T>
      | ResponsiveNumberControl<T>
      | CheckboxControl<T>
      | ResponsiveColorControl<T>
      | NumberControl<T>
      | ResponsiveIconRadioGroupControl<
          T extends ResponsiveIconRadioGroupControlValue ? T : ResponsiveIconRadioGroupControlValue
        >
      | ResponsiveSelectControl<
          T extends ResponsiveSelectControlValue ? T : ResponsiveSelectControlValue
        >
      | ResponsiveLengthControl<T>
      | DateControl<T>
      | LinkControl<T>
      | TextInputControl<T>
      | TextStyleControl<T>
      | ImageControl<T>
      | RichTextControl<T>
      | RichTextV2ControlDefinition
      | ComboboxControlDefinition
      | ShapeControlDefinition
      | ListControlDefinition
      | StyleV2ControlDefinition
    >
  | SerializedListControl<T extends ListControlValue ? T : ListControlValue>
  | SerializedShapeControl<T extends ShapeControlValue ? T : ShapeControlValue, any>
  | SerializedTypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>
  | SerializedGapXControl<T>
  | SerializedGapYControl<T>
  | SerializedResponsiveNumberControl<T>
  | SerializedCheckboxControl<T>
  | SerializedResponsiveColorControl<T>
  | SerializedNumberControl<T>
  | SerializedResponsiveIconRadioGroupControl<T>
  | SerializedResponsiveSelectControl<T>
  | SerializedResponsiveLengthControl<T>
  | SerializedDateControl<T>
  | SerializedLinkControl<T>
  | SerializedTextInputControl<T>
  | SerializedTextStyleControl<T>
  | SerializedImageControl<T>
  | SerializedRichTextControl<T>
  | Serialize<RichTextV2ControlDefinition>
  | Serialize<ComboboxControlDefinition>
  | Serialize<ShapeControlDefinition>
  | Serialize<ListControlDefinition>
  | Serialize<StyleV2ControlDefinition>

export type DeserializedPanelControl<T extends Data = Data> = Extract<
  DeserializedControl<T>,
  { type: PanelControlType }
>

type DeserializedPanelControlValueType<T extends DeserializedPanelControl> =
  T extends DeserializedPanelControl<infer U> ? U : never

type DeserializedShapeControlConfig<T extends Record<string, DeserializedPanelControl>> = {
  type: T
  preset?: { [K in keyof T]?: DeserializedPanelControlValueType<T[K]> }
}

export type DeserializedShapeControl<
  _T extends Record<string, Data>,
  U extends Record<string, DeserializedPanelControl>,
> = {
  type: typeof Controls.Types.Shape
  options: DeserializedShapeControlConfig<U>
}

type DeserializedListControlConfig<T extends Data> = {
  type: DeserializedPanelControl<T>
  label?: string
  getItemLabel?: DeserializedFunction<Exclude<ListControlConfig<T>['getItemLabel'], undefined>>
  preset?: ListControlValue<T>
  defaultValue?: ListControlValue<T>
}

export type DeserializedListControl<T extends ListControlValue = ListControlValue> = {
  type: typeof Controls.Types.List
  options: DeserializedListControlConfig<T extends ListControlValue<infer U> ? U : never>
}

type DeserializedTypeaheadControlConfig<T extends Data> = {
  getItems: DeserializedFunction<TypeaheadControlConfig<T>['getItems']>
  label?: string
  preset?: TypeaheadControlValue<T>
  defaultValue?: TypeaheadControlValue<T>
}

export type DeserializedTypeaheadControl<T extends TypeaheadControlValue = TypeaheadControlValue> =
  {
    type: typeof Controls.Types.Typeahead
    options: DeserializedTypeaheadControlConfig<T['value']>
  }

type DeserializedConfig<T> =
  | T
  | DeserializedFunction<(props: Record<string, unknown>, deviceMode: Device) => T>

export type DeserializedGapXControl<_T = GapXControlValue> = {
  type: typeof Controls.Types.GapX
  options: DeserializedConfig<GapXControlConfig>
}

export type DeserializedGapYControl<_T = GapYControlValue> = {
  type: typeof Controls.Types.GapY
  options: DeserializedConfig<GapYControlConfig>
}

export type DeserializedResponsiveNumberControl<_T = ResponsiveNumberControlValue> = {
  type: typeof Controls.Types.ResponsiveNumber
  options: DeserializedConfig<ResponsiveNumberControlConfig>
}

export type DeserializedCheckboxControl<_T = CheckboxControlValue> = {
  type: typeof Controls.Types.Checkbox
  options: DeserializedConfig<CheckboxControlConfig>
}

export type DeserializedResponsiveColorControl<_T = ResponsiveColorControlValue> = {
  type: typeof Controls.Types.ResponsiveColor
  options: DeserializedConfig<ResponsiveColorControlConfig>
}

export type DeserializedNumberControl<_T = NumberControlValue> = {
  type: typeof Controls.Types.Number
  options: DeserializedConfig<NumberControlConfig>
}

export type DeserializedResponsiveIconRadioGroupControl<_T = ResponsiveIconRadioGroupControlValue> =
  {
    type: typeof Controls.Types.ResponsiveIconRadioGroup
    options: DeserializedConfig<ResponsiveIconRadioGroupControlConfig>
  }

export type DeserializedDateControl<_T = DateControlValue> = {
  type: typeof Controls.Types.Date
  options: DeserializedConfig<DateControlConfig>
}

export type DeserializedLinkControl<_T = LinkControlValue> = {
  type: typeof Controls.Types.Link
  options: DeserializedConfig<LinkControlConfig>
}

export type DeserializedTextInputControl<_T = TextInputControlValue> = {
  type: typeof Controls.Types.TextInput
  options: DeserializedConfig<TextInputControlConfig>
}

export type DeserializedResponsiveSelectControl<_T = ResponsiveSelectControlValue> = {
  type: typeof Controls.Types.ResponsiveSelect
  options: DeserializedConfig<ResponsiveSelectControlConfig>
}

export type DeserializedResponsiveLengthControl<_T = ResponsiveLengthControlValue> = {
  type: typeof Controls.Types.ResponsiveLength
  options: DeserializedConfig<ResponsiveLengthControlConfig>
}

export type DeserializedTextStyleControl<_T = TextStyleControlValue> = {
  type: typeof Controls.Types.TextStyle
  options: DeserializedConfig<TextStyleControlConfig>
}

export type DeserializedImageControl<_T = ImageControlValue> = {
  type: typeof Controls.Types.Image
  options: DeserializedConfig<ImageControlConfig>
}

export type DeserializedRichTextControl<_T = RichTextControlValue> = {
  type: typeof Controls.Types.RichText
  options: DeserializedConfig<RichTextControlConfig>
}

export type DeserializedControl<T extends Data = Data> =
  | Exclude<
      Control<T>,
      | ListControl<T extends ListControlValue ? T : ListControlValue>
      | ShapeControl<T extends ShapeControlValue ? T : ShapeControlValue, any>
      | TypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>
      | GapXControl<T>
      | GapYControl<T>
      | ResponsiveNumberControl<T>
      | CheckboxControl<T>
      | ResponsiveColorControl<T>
      | NumberControl<T>
      | ResponsiveIconRadioGroupControl<
          T extends ResponsiveIconRadioGroupControlValue ? T : ResponsiveIconRadioGroupControlValue
        >
      | ResponsiveSelectControl<
          T extends ResponsiveSelectControlValue ? T : ResponsiveSelectControlValue
        >
      | ResponsiveLengthControl<T>
      | DateControl<T>
      | LinkControl<T>
      | TextInputControl<T>
      | TextStyleControl<T>
      | ImageControl<T>
      | RichTextControl<T>
      | RichTextV2ControlDefinition
      | ComboboxControlDefinition
      | ShapeControlDefinition
      | ListControlDefinition
      | StyleV2ControlDefinition
    >
  | DeserializedListControl<T extends ListControlValue ? T : ListControlValue>
  | DeserializedShapeControl<T extends ShapeControlValue ? T : ShapeControlValue, any>
  | DeserializedTypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>
  | DeserializedGapXControl<T>
  | DeserializedGapYControl<T>
  | DeserializedResponsiveNumberControl<T>
  | DeserializedCheckboxControl<T>
  | DeserializedResponsiveColorControl<T>
  | DeserializedNumberControl<T>
  | DeserializedResponsiveIconRadioGroupControl<T>
  | DeserializedResponsiveSelectControl<T>
  | DeserializedResponsiveLengthControl<T>
  | DeserializedDateControl<T>
  | DeserializedLinkControl<T>
  | DeserializedTextInputControl<T>
  | DeserializedTextStyleControl<T>
  | DeserializedImageControl<T>
  | DeserializedRichTextControl<T>
  | Deserialize<Serialize<RichTextV2ControlDefinition>>
  | Deserialize<Serialize<ComboboxControlDefinition>>
  | Deserialize<Serialize<ShapeControlDefinition>>
  | Deserialize<Serialize<ListControlDefinition>>
  | Deserialize<Serialize<StyleV2ControlDefinition>>
