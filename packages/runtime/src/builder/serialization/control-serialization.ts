import { ListControlDefinition, ListControlType } from '../../controls'
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
  PanelDescriptor as PanelControl,
  PanelDescriptorType as PanelControlType,
  PanelDescriptorValueType as PanelControlValueType,
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
import { deserializeListControlDefinition, serializeListControlDefinition } from './controls/list'
import { Deserialize, Serialize } from './controls/types'
import {
  DeserializedFunction,
  deserializeFunction,
  isSerializedFunction,
  SerializedFunction,
  serializeFunction,
} from './function-serialization'

type SerializedShapeControlConfig<T extends Record<string, SerializedPanelControl>> = {
  type: T
  preset?: { [K in keyof T]?: SerializedPanelControlValueType<T[K]> }
}

type SerializedShapeControl<
  _T extends Record<string, Data>,
  U extends Record<string, SerializedPanelControl>,
> = {
  type: typeof Controls.Types.Shape
  options: SerializedShapeControlConfig<U>
}

function serializeShapeControl<
  T extends Record<string, Data>,
  U extends Record<string, PanelControl>,
>(
  control: ShapeControl<T, U>,
): [
  SerializedShapeControl<
    T,
    { [K in keyof U]: SerializedPanelControl<PanelControlValueType<U[K]>> }
  >,
  Transferable[],
] {
  const { type } = control.options
  const transferables: Transferable[] = []
  const serializedType = {} as {
    [K in keyof U]: SerializedPanelControl<PanelControlValueType<U[K]>>
  }

  Object.entries(type).forEach(([key, control]) => {
    const [serializedControl, serializedControlTransferables] = serializeControl(control)

    serializedType[key as keyof typeof type] = serializedControl as SerializedPanelControl
    transferables.push(...serializedControlTransferables)
  })

  // @ts-expect-error: preset types are incompatible
  return [{ ...control, options: { ...control.options, type: serializedType } }, transferables]
}

type DeserializedShapeControlConfig<T extends Record<string, DeserializedPanelControl>> = {
  type: T
  preset?: { [K in keyof T]?: DeserializedPanelControlValueType<T[K]> }
}

type DeserializedShapeControl<
  _T extends Record<string, Data>,
  U extends Record<string, DeserializedPanelControl>,
> = {
  type: typeof Controls.Types.Shape
  options: DeserializedShapeControlConfig<U>
}

function deserializeShapeControl<
  T extends Record<string, Data>,
  U extends Record<string, SerializedPanelControl>,
>(
  control: SerializedShapeControl<T, U>,
): DeserializedShapeControl<
  T,
  { [K in keyof U]: DeserializedPanelControl<SerializedPanelControlValueType<U[K]>> }
> {
  const { type } = control.options
  const deserializedType = {} as {
    [K in keyof U]: DeserializedPanelControl<SerializedPanelControlValueType<U[K]>>
  }

  Object.entries(type).forEach(([key, control]) => {
    deserializedType[key as keyof typeof type] = deserializeControl(
      control,
    ) as DeserializedPanelControl
  })

  // @ts-expect-error: preset types are incompatible
  return { ...control, options: { ...control.options, type: deserializedType } }
}

type SerializedListControlConfig<T extends Data> = {
  type: SerializedPanelControl<T>
  label?: string
  getItemLabel?: SerializedFunction<Exclude<ListControlConfig<T>['getItemLabel'], undefined>>
  preset?: ListControlValue<T>
  defaultValue?: ListControlValue<T>
}

type SerializedListControl<T extends ListControlValue = ListControlValue> = {
  type: typeof Controls.Types.List
  options: SerializedListControlConfig<T extends ListControlValue<infer U> ? U : never>
}

function serializeListControl<T extends Data>(
  control: ListControl<ListControlValue<T>>,
): [SerializedListControl<ListControlValue<T>>, Transferable[]] {
  const { type, getItemLabel } = control.options
  const transferables: Transferable[] = []

  const [serializedType, serializedTypeTransferables] = serializeControl(type)
  const serializedGetItemLabel = getItemLabel && serializeFunction(getItemLabel)

  transferables.push(...serializedTypeTransferables)
  if (serializedGetItemLabel != null) transferables.push(serializedGetItemLabel)

  return [
    {
      ...control,
      options: {
        ...control.options,
        type: serializedType as SerializedPanelControl,
        getItemLabel: serializedGetItemLabel,
      },
    },
    transferables,
  ]
}

type DeserializedListControlConfig<T extends Data> = {
  type: DeserializedPanelControl<T>
  label?: string
  getItemLabel?: DeserializedFunction<Exclude<ListControlConfig<T>['getItemLabel'], undefined>>
  preset?: ListControlValue<T>
  defaultValue?: ListControlValue<T>
}

type DeserializedListControl<T extends ListControlValue = ListControlValue> = {
  type: typeof Controls.Types.List
  options: DeserializedListControlConfig<T extends ListControlValue<infer U> ? U : never>
}

function deserializeListControl<T extends Data>(
  serializedControl: SerializedListControl<ListControlValue<T>>,
): DeserializedListControl<ListControlValue<T>> {
  const { type, getItemLabel } = serializedControl.options

  const deserializedType = deserializeControl(type) as DeserializedPanelControl
  const deserializedGetItemLabel = getItemLabel && deserializeFunction(getItemLabel)

  return {
    ...serializedControl,
    options: {
      ...serializedControl.options,
      type: deserializedType,
      getItemLabel: deserializedGetItemLabel,
    },
  }
}

type SerializedTypeaheadControlConfig<T extends Data> = {
  getItems: SerializedFunction<TypeaheadControlConfig<T>['getItems']>
  label?: string
  preset?: TypeaheadControlValue<T>
  defaultValue?: TypeaheadControlValue<T>
}

type SerializedTypeaheadControl<T extends TypeaheadControlValue = TypeaheadControlValue> = {
  type: typeof Controls.Types.Typeahead
  options: SerializedTypeaheadControlConfig<T['value']>
}

function serializeTypeaheadControl<T extends Data>(
  control: TypeaheadControl<TypeaheadControlValue<T>>,
): [SerializedTypeaheadControl<TypeaheadControlValue<T>>, Transferable[]] {
  const { getItems } = control.options

  const serializedGetItems = getItems && serializeFunction(getItems)

  return [
    { ...control, options: { ...control.options, getItems: serializedGetItems } },
    serializedGetItems == null ? [] : [serializedGetItems],
  ]
}

type DeserializedTypeaheadControlConfig<T extends Data> = {
  getItems: DeserializedFunction<TypeaheadControlConfig<T>['getItems']>
  label?: string
  preset?: TypeaheadControlValue<T>
  defaultValue?: TypeaheadControlValue<T>
}

type DeserializedTypeaheadControl<T extends TypeaheadControlValue = TypeaheadControlValue> = {
  type: typeof Controls.Types.Typeahead
  options: DeserializedTypeaheadControlConfig<T['value']>
}

function deserializeTypeaheadControl<T extends Data>(
  serializedControl: SerializedTypeaheadControl<TypeaheadControlValue<T>>,
): DeserializedTypeaheadControl<TypeaheadControlValue<T>> {
  const { getItems } = serializedControl.options

  const deserializedGetItems = getItems && deserializeFunction(getItems)

  return {
    ...serializedControl,
    options: { ...serializedControl.options, getItems: deserializedGetItems },
  }
}

type SerializedConfig<T> =
  | T
  | SerializedFunction<(props: Record<string, unknown>, deviceMode: Device) => T>

type DeserializedConfig<T> =
  | T
  | DeserializedFunction<(props: Record<string, unknown>, deviceMode: Device) => T>

type GapXControlConfig = {
  preset?: GapXControlValue
  label?: string
  defaultValue?: Gap
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}

type SerializedGapXControl<_T = GapXControlValue> = {
  type: typeof Controls.Types.GapX
  options: SerializedConfig<GapXControlConfig>
}

function serializeGapXControl(control: GapXControl): [SerializedGapXControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedGapXControl<_T = GapXControlValue> = {
  type: typeof Controls.Types.GapX
  options: DeserializedConfig<GapXControlConfig>
}

function deserializeGapXControl(serializedControl: SerializedGapXControl): DeserializedGapXControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
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

type SerializedGapYControl<_T = GapYControlValue> = {
  type: typeof Controls.Types.GapY
  options: SerializedConfig<GapYControlConfig>
}

function serializeGapYControl(control: GapYControl): [SerializedGapYControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedGapYControl<_T = GapYControlValue> = {
  type: typeof Controls.Types.GapY
  options: DeserializedConfig<GapYControlConfig>
}

function deserializeGapYControl(serializedControl: SerializedGapYControl): DeserializedGapYControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
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

type SerializedResponsiveNumberControl<_T = ResponsiveNumberControlValue> = {
  type: typeof Controls.Types.ResponsiveNumber
  options: SerializedConfig<ResponsiveNumberControlConfig>
}

function serializeResponsiveNumberControl(
  control: ResponsiveNumberControl,
): [SerializedResponsiveNumberControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedResponsiveNumberControl<_T = ResponsiveNumberControlValue> = {
  type: typeof Controls.Types.ResponsiveNumber
  options: DeserializedConfig<ResponsiveNumberControlConfig>
}

function deserializeResponsiveNumberControl(
  serializedControl: SerializedResponsiveNumberControl,
): DeserializedResponsiveNumberControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type CheckboxControlConfig = {
  preset?: CheckboxControlValue
  label: string
  hidden?: boolean
}

type SerializedCheckboxControl<_T = CheckboxControlValue> = {
  type: typeof Controls.Types.Checkbox
  options: SerializedConfig<CheckboxControlConfig>
}

function serializeCheckboxControl(
  control: CheckboxControl,
): [SerializedCheckboxControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedCheckboxControl<_T = CheckboxControlValue> = {
  type: typeof Controls.Types.Checkbox
  options: DeserializedConfig<CheckboxControlConfig>
}

function deserializeCheckboxControl(
  serializedControl: SerializedCheckboxControl,
): DeserializedCheckboxControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type ResponsiveColorControlConfig = { label?: string; placeholder?: string; hidden?: boolean }

type SerializedResponsiveColorControl<_T = ResponsiveColorControlValue> = {
  type: typeof Controls.Types.ResponsiveColor
  options: SerializedConfig<ResponsiveColorControlConfig>
}

function serializeResponsiveColorControl(
  control: ResponsiveColorControl,
): [SerializedResponsiveColorControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedResponsiveColorControl<_T = ResponsiveColorControlValue> = {
  type: typeof Controls.Types.ResponsiveColor
  options: DeserializedConfig<ResponsiveColorControlConfig>
}

function deserializeResponsiveColorControl(
  serializedControl: SerializedResponsiveColorControl,
): DeserializedResponsiveColorControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
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

type SerializedNumberControl<_T = NumberControlValue> = {
  type: typeof Controls.Types.Number
  options: SerializedConfig<NumberControlConfig>
}

function serializeNumberControl(control: NumberControl): [SerializedNumberControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedNumberControl<_T = NumberControlValue> = {
  type: typeof Controls.Types.Number
  options: DeserializedConfig<NumberControlConfig>
}

function deserializeNumberControl(
  serializedControl: SerializedNumberControl,
): DeserializedNumberControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}
type ResponsiveIconRadioGroupControlConfig<T extends string = string, U extends T = T> = {
  label?: string
  options: IconRadioGroupOption<T>[]
  defaultValue?: U
  hidden?: boolean
}

type SerializedResponsiveIconRadioGroupControl<_T = ResponsiveIconRadioGroupControlValue> = {
  type: typeof Controls.Types.ResponsiveIconRadioGroup
  options: SerializedConfig<ResponsiveIconRadioGroupControlConfig>
}

function serializeResponsiveIconRadioGroupControl(
  control: ResponsiveIconRadioGroupControl,
): [SerializedResponsiveIconRadioGroupControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedResponsiveIconRadioGroupControl<_T = ResponsiveIconRadioGroupControlValue> = {
  type: typeof Controls.Types.ResponsiveIconRadioGroup
  options: DeserializedConfig<ResponsiveIconRadioGroupControlConfig>
}

function deserializeResponsiveIconRadioGroupControl(
  serializedControl: SerializedResponsiveIconRadioGroupControl,
): DeserializedResponsiveIconRadioGroupControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type DateControlConfig = { preset?: DateControlValue }

type SerializedDateControl<_T = DateControlValue> = {
  type: typeof Controls.Types.Date
  options: SerializedConfig<DateControlConfig>
}

function serializeDateControl(control: DateControl): [SerializedDateControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedDateControl<_T = DateControlValue> = {
  type: typeof Controls.Types.Date
  options: DeserializedConfig<DateControlConfig>
}

function deserializeDateControl(serializedControl: SerializedDateControl): DeserializedDateControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type LinkControlConfig = {
  preset?: LinkControlValue
  label?: string
  defaultValue?: LinkControlValue
  options?: { value: LinkControlValue['type']; label: string }[]
  hidden?: boolean
}

type SerializedLinkControl<_T = LinkControlValue> = {
  type: typeof Controls.Types.Link
  options: SerializedConfig<LinkControlConfig>
}

function serializeLinkControl(control: LinkControl): [SerializedLinkControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedLinkControl<_T = LinkControlValue> = {
  type: typeof Controls.Types.Link
  options: DeserializedConfig<LinkControlConfig>
}

function deserializeLinkControl(serializedControl: SerializedLinkControl): DeserializedLinkControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type TextInputControlConfig = { label?: string; placeholder?: string; hidden?: boolean }

type SerializedTextInputControl<_T = TextInputControlValue> = {
  type: typeof Controls.Types.TextInput
  options: SerializedConfig<TextInputControlConfig>
}

function serializeTextInputControl(
  control: TextInputControl,
): [SerializedTextInputControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedTextInputControl<_T = TextInputControlValue> = {
  type: typeof Controls.Types.TextInput
  options: DeserializedConfig<TextInputControlConfig>
}

function deserializeTextInputControl(
  serializedControl: SerializedTextInputControl,
): DeserializedTextInputControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type SerializedResponsiveSelectControl<_T = ResponsiveSelectControlValue> = {
  type: typeof Controls.Types.ResponsiveSelect
  options: SerializedConfig<ResponsiveSelectControlConfig>
}

function serializeResponsiveSelectControl(
  control: ResponsiveSelectControl,
): [SerializedResponsiveSelectControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type ResponsiveSelectControlConfig<T extends string = string, U extends T = T> = {
  label?: string
  labelOrientation?: SelectLabelOrientation
  options: SelectOption<T>[]
  defaultValue?: U
  hidden?: boolean
}

type DeserializedResponsiveSelectControl<_T = ResponsiveSelectControlValue> = {
  type: typeof Controls.Types.ResponsiveSelect
  options: DeserializedConfig<ResponsiveSelectControlConfig>
}

function deserializeResponsiveSelectControl(
  serializedControl: SerializedResponsiveSelectControl,
): DeserializedResponsiveSelectControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type ResponsiveLengthControlConfig = {
  label?: string
  options?: LengthOption[]
  defaultValue?: Length
  hidden?: boolean
}

type SerializedResponsiveLengthControl<_T = ResponsiveLengthControlValue> = {
  type: typeof Controls.Types.ResponsiveLength
  options: SerializedConfig<ResponsiveLengthControlConfig>
}

function serializeResponsiveLengthControl(
  control: ResponsiveLengthControl,
): [SerializedResponsiveLengthControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedResponsiveLengthControl<_T = ResponsiveLengthControlValue> = {
  type: typeof Controls.Types.ResponsiveLength
  options: DeserializedConfig<ResponsiveLengthControlConfig>
}

function deserializeResponsiveLengthControl(
  serializedControl: SerializedResponsiveLengthControl,
): DeserializedResponsiveLengthControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type SerializedTextStyleControl<_T = TextStyleControlValue> = {
  type: typeof Controls.Types.TextStyle
  options: SerializedConfig<TextStyleControlConfig>
}

function serializeTextStyleControl(
  control: TextStyleControl,
): [SerializedTextStyleControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type TextStyleControlConfig = {
  preset?: TextStyleControlValue
  label?: string
  hidden?: boolean
}

type DeserializedTextStyleControl<_T = TextStyleControlValue> = {
  type: typeof Controls.Types.TextStyle
  options: DeserializedConfig<TextStyleControlConfig>
}

function deserializeTextStyleControl(
  serializedControl: SerializedTextStyleControl,
): DeserializedTextStyleControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type ImageControlConfig = { label?: string; hidden?: boolean }

type SerializedImageControl<_T = ImageControlValue> = {
  type: typeof Controls.Types.Image
  options: SerializedConfig<ImageControlConfig>
}

function serializeImageControl(control: ImageControl): [SerializedImageControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedImageControl<_T = ImageControlValue> = {
  type: typeof Controls.Types.Image
  options: DeserializedConfig<ImageControlConfig>
}

function deserializeImageControl(
  serializedControl: SerializedImageControl,
): DeserializedImageControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type RichTextControlConfig = { preset?: RichTextControlValue }

type SerializedRichTextControl<_T = RichTextControlValue> = {
  type: typeof Controls.Types.RichText
  options: SerializedConfig<RichTextControlConfig>
}

function serializeRichTextControl(
  control: RichTextControl,
): [SerializedRichTextControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedRichTextControl<_T = RichTextControlValue> = {
  type: typeof Controls.Types.RichText
  options: DeserializedConfig<RichTextControlConfig>
}

function deserializeRichTextControl(
  serializedControl: SerializedRichTextControl,
): DeserializedRichTextControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
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
      | ListControlDefinition
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
  | Serialize<ListControlDefinition>

type SerializedPanelControl<T extends Data = Data> = Extract<
  SerializedControl<T>,
  { type: PanelControlType }
>

type SerializedPanelControlValueType<T extends SerializedPanelControl> =
  T extends SerializedPanelControl<infer U> ? U : never

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
      | ListControlDefinition
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
  | Deserialize<Serialize<ListControlDefinition>>

export type DeserializedPanelControl<T extends Data = Data> = Extract<
  DeserializedControl<T>,
  { type: PanelControlType }
>

type DeserializedPanelControlValueType<T extends DeserializedPanelControl> =
  T extends DeserializedPanelControl<infer U> ? U : never

function serializeControl<T extends Data>(
  control: Control<T>,
): [SerializedControl<T>, Transferable[]] {
  switch (control.type) {
    case Controls.Types.Checkbox:
      return serializeCheckboxControl(control)

    case Controls.Types.List:
      return serializeListControl(control)

    case Controls.Types.Shape:
      return serializeShapeControl(control)

    case Controls.Types.Typeahead:
      return serializeTypeaheadControl(control)

    case Controls.Types.GapX:
      return serializeGapXControl(control)

    case Controls.Types.GapY:
      return serializeGapYControl(control)

    case Controls.Types.ResponsiveColor:
      return serializeResponsiveColorControl(control)

    case Controls.Types.ResponsiveNumber:
      return serializeResponsiveNumberControl(control)

    case Controls.Types.Number:
      return serializeNumberControl(control)

    case Controls.Types.ResponsiveIconRadioGroup:
      return serializeResponsiveIconRadioGroupControl(control)

    case Controls.Types.ResponsiveSelect:
      return serializeResponsiveSelectControl(control)

    case Controls.Types.ResponsiveLength:
      return serializeResponsiveLengthControl(control)

    case Controls.Types.Date:
      return serializeDateControl(control)

    case Controls.Types.Link:
      return serializeLinkControl(control)

    case Controls.Types.TextInput:
      return serializeTextInputControl(control)

    case Controls.Types.TextStyle:
      return serializeTextStyleControl(control)

    case Controls.Types.Image:
      return serializeImageControl(control)

    case Controls.Types.RichText:
      return serializeRichTextControl(control)

    case ListControlType:
      return serializeListControlDefinition(control)

    default:
      return [control, []]
  }
}

function deserializeControl<T extends Data>(
  serializedControl: SerializedControl<T>,
): DeserializedControl<T> {
  switch (serializedControl.type) {
    case Controls.Types.Checkbox:
      return deserializeCheckboxControl(serializedControl)

    case Controls.Types.List:
      return deserializeListControl(serializedControl)

    case Controls.Types.Shape:
      return deserializeShapeControl(serializedControl)

    case Controls.Types.Typeahead:
      return deserializeTypeaheadControl(serializedControl)

    case Controls.Types.GapX:
      return deserializeGapXControl(serializedControl)

    case Controls.Types.GapY:
      return deserializeGapYControl(serializedControl)

    case Controls.Types.ResponsiveColor:
      return deserializeResponsiveColorControl(serializedControl)

    case Controls.Types.ResponsiveNumber:
      return deserializeResponsiveNumberControl(serializedControl)

    case Controls.Types.Number:
      return deserializeNumberControl(serializedControl)

    case Controls.Types.ResponsiveIconRadioGroup:
      return deserializeResponsiveIconRadioGroupControl(serializedControl)

    case Controls.Types.ResponsiveSelect:
      return deserializeResponsiveSelectControl(serializedControl)

    case Controls.Types.ResponsiveLength:
      return deserializeResponsiveLengthControl(serializedControl)

    case Controls.Types.Date:
      return deserializeDateControl(serializedControl)

    case Controls.Types.Link:
      return deserializeLinkControl(serializedControl)

    case Controls.Types.TextInput:
      return deserializeTextInputControl(serializedControl)

    case Controls.Types.TextStyle:
      return deserializeTextStyleControl(serializedControl)

    case Controls.Types.Image:
      return deserializeImageControl(serializedControl)

    case Controls.Types.RichText:
      return deserializeRichTextControl(serializedControl)

    case ListControlType:
      return deserializeListControlDefinition(serializedControl)

    default:
      return serializedControl
  }
}

export function serializeControls(
  controls: Record<string, Control>,
): [Record<string, SerializedControl>, Transferable[]] {
  return Object.entries(controls).reduce(
    ([accControls, accTransferables], [key, control]) => {
      const [serializedControl, transferables] = serializeControl(control)

      return [{ ...accControls, [key]: serializedControl }, [...accTransferables, ...transferables]]
    },
    [{}, []] as [Record<string, SerializedControl>, Transferable[]],
  )
}

export function deserializeControls(
  serializedControls: Record<string, SerializedControl>,
): Record<string, DeserializedControl> {
  return Object.entries(serializedControls).reduce(
    (deserializedControls, [key, serializedControl]) => {
      return { ...deserializedControls, [key]: deserializeControl(serializedControl) }
    },
    {} as Record<string, DeserializedControl>,
  )
}
