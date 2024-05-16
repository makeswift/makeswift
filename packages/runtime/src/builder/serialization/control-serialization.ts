import {
  GapData,
  GapX,
  GapYDescriptor,
  GapYPropControllerData,
  ResponsiveLengthOptions,
  ResponsiveLengthPropControllerData,
  ResponsiveIconRadioGroup,
  ResponsiveNumber,
  ResponsiveSelect,
  type Descriptor,
  type PropDef,
  type OptionsType,
} from '@makeswift/prop-controllers'
import {
  ComboboxControlDefinition,
  ComboboxControlType,
  ListControlDefinition,
  ListControlType,
  RichTextV2ControlDefinition,
  RichTextV2ControlType,
  ShapeControlDefinition,
  ShapeControlType,
  StyleV2ControlDefinition,
  StyleV2ControlType,
  RichTextValue as RichTextControlValue,
} from '../../controls'
import {
  Data,
  Device,
  PanelDescriptor as PanelControl,
  PanelDescriptorType as PanelControlType,
  PanelDescriptorValueType as PanelControlValueType,
  PropControllerDescriptor as Control,
} from '../../prop-controllers'
import {
  DELETED_PROP_CONTROLLER_TYPES,
  ListDescriptor as ListControl,
  ListOptions as ListControlConfig,
  ListValue as ListControlValue,
  ShapeDescriptor as ShapeControl,
  ShapeValue as ShapeControlValue,
  TypeaheadDescriptor as TypeaheadControl,
  TypeaheadOptions as TypeaheadControlConfig,
  TypeaheadValue as TypeaheadControlValue,
  RichTextDescriptor as RichTextControl,
} from '../../prop-controllers/deleted'
import {
  deserializeComboboxControlDefinition,
  serializeComboboxControlDefinition,
} from './controls/combobox'
import { deserializeListControlDefinition, serializeListControlDefinition } from './controls/list'
import { deserializeRichTextControlV2, serializeRichTextControlV2 } from './controls/rich-text-v2'
import {
  deserializeShapeControlDefinition,
  serializeShapeControlDefinition,
} from './controls/shape'
import { deserializeStyleV2Control, serializeStyleV2Control } from './controls/style-v2'
import { Deserialize, Serialize } from './controls/types'
import {
  DeserializedFunction,
  deserializeFunction,
  isSerializedFunction,
  SerializedFunction,
  serializeFunction,
} from './function-serialization'
import {
  LinkData,
  DateDescriptor as DateControl,
  DatePropControllerData,
  Types as PropControllerTypes,
  ImageDescriptor as ImageControl,
  ImageData as ImageControlValue,
  LinkDescriptor as LinkControl,
  LinkPropControllerData,
  ResponsiveLengthDescriptor,
  NumberOptions,
  NumberPropControllerData,
  NumberDescriptor,
  ResponsiveColorPropControllerData,
  ResponsiveColorDescriptor,
  CheckboxPropControllerData,
  CheckboxDescriptor as CheckboxControl,
  TextStyleDescriptor as TextStyleControl,
  TextStylePropControllerData,
  TextInputDescriptor as TextInputControl,
} from '@makeswift/prop-controllers'

type SerializedShapeControlConfig<T extends Record<string, SerializedPanelControl>> = {
  type: T
  preset?: { [K in keyof T]?: SerializedPanelControlValueType<T[K]> }
}

type SerializedShapeControl<
  _T extends Record<string, Data>,
  U extends Record<string, SerializedPanelControl>,
> = {
  type: typeof DELETED_PROP_CONTROLLER_TYPES.Shape
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
  type: typeof DELETED_PROP_CONTROLLER_TYPES.Shape
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
  type: typeof DELETED_PROP_CONTROLLER_TYPES.List
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
  type: typeof DELETED_PROP_CONTROLLER_TYPES.List
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
  type: typeof DELETED_PROP_CONTROLLER_TYPES.Typeahead
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
  type: typeof DELETED_PROP_CONTROLLER_TYPES.Typeahead
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

export type DeserializedConfig<T> =
  | T
  | DeserializedFunction<(props: Record<string, unknown>, deviceMode: Device) => T>

type SerializedControlDef<P extends PropDef> = Descriptor<P> & {
  options: SerializedConfig<OptionsType<P>>
}

function serializeControlDef<P extends PropDef>(
  control: Descriptor<P>,
): [SerializedControlDef<P>, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

export type DeserializedControlDef<P extends PropDef> = Descriptor<P> & {
  options: DeserializedConfig<OptionsType<P>>
}

function deserializeControlDef<P extends PropDef>(
  serializedControl: SerializedControlDef<P>,
): DeserializedControlDef<P> {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type GapYControlConfig = {
  preset?: GapYPropControllerData
  label?: string
  defaultValue?: GapData
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}

type SerializedGapYControl<_T = GapYPropControllerData> = {
  type: typeof PropControllerTypes.GapY
  options: SerializedConfig<GapYControlConfig>
}

function serializeGapYControl(control: GapYDescriptor): [SerializedGapYControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedGapYControl<_T = GapYPropControllerData> = {
  type: typeof PropControllerTypes.GapY
  options: DeserializedConfig<GapYControlConfig>
}

function deserializeGapYControl(serializedControl: SerializedGapYControl): DeserializedGapYControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type CheckboxControlConfig = {
  preset?: CheckboxPropControllerData
  label: string
  hidden?: boolean
}

type SerializedCheckboxControl<_T = CheckboxPropControllerData> = {
  type: typeof PropControllerTypes.Checkbox
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

type DeserializedCheckboxControl<_T = CheckboxPropControllerData> = {
  type: typeof PropControllerTypes.Checkbox
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

type SerializedResponsiveColorControl<_T = ResponsiveColorPropControllerData> = {
  type: typeof PropControllerTypes.ResponsiveColor
  options: SerializedConfig<ResponsiveColorControlConfig>
}

function serializeResponsiveColorControl(
  control: ResponsiveColorDescriptor,
): [SerializedResponsiveColorControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedResponsiveColorControl<_T = ResponsiveColorPropControllerData> = {
  type: typeof PropControllerTypes.ResponsiveColor
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
type SerializedNumberControl<_T = NumberPropControllerData> = {
  type: typeof PropControllerTypes.Number
  options: SerializedConfig<NumberOptions>
}

function serializeNumberControl(
  control: NumberDescriptor,
): [SerializedNumberControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedNumberControl<_T = NumberPropControllerData> = {
  type: typeof PropControllerTypes.Number
  options: DeserializedConfig<NumberOptions>
}

function deserializeNumberControl(
  serializedControl: SerializedNumberControl,
): DeserializedNumberControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type DateControlConfig = { preset?: DatePropControllerData }

type SerializedDateControl<_T = DatePropControllerData> = {
  type: typeof PropControllerTypes.Date
  options: SerializedConfig<DateControlConfig>
}

function serializeDateControl(control: DateControl): [SerializedDateControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedDateControl<_T = DatePropControllerData> = {
  type: typeof PropControllerTypes.Date
  options: DeserializedConfig<DateControlConfig>
}

function deserializeDateControl(serializedControl: SerializedDateControl): DeserializedDateControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type LinkControlConfig = {
  preset?: LinkPropControllerData
  label?: string
  defaultValue?: LinkPropControllerData
  options?: { value: LinkData['type']; label: string }[]
  hidden?: boolean
}

type SerializedLinkControl<_T = LinkPropControllerData> = {
  type: typeof PropControllerTypes.Link
  options: SerializedConfig<LinkControlConfig>
}

function serializeLinkControl(control: LinkControl): [SerializedLinkControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedLinkControl<_T = LinkPropControllerData> = {
  type: typeof PropControllerTypes.Link
  options: DeserializedConfig<LinkControlConfig>
}

function deserializeLinkControl(serializedControl: SerializedLinkControl): DeserializedLinkControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type TextInputControlConfig = { label?: string; placeholder?: string; hidden?: boolean }

type TextInputControlValue = string

type SerializedTextInputControl<_T = TextInputControlValue> = {
  type: typeof PropControllerTypes.TextInput
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
  type: typeof PropControllerTypes.TextInput
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

type SerializedResponsiveLengthControl<_T = ResponsiveLengthPropControllerData> = {
  type: typeof PropControllerTypes.ResponsiveLength
  options: SerializedConfig<ResponsiveLengthOptions>
}

function serializeResponsiveLengthControl(
  control: ResponsiveLengthDescriptor,
): [SerializedResponsiveLengthControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedResponsiveLengthControl<_T = ResponsiveLengthPropControllerData> = {
  type: typeof PropControllerTypes.ResponsiveLength
  options: DeserializedConfig<ResponsiveLengthOptions>
}

function deserializeResponsiveLengthControl(
  serializedControl: SerializedResponsiveLengthControl,
): DeserializedResponsiveLengthControl {
  const { options } = serializedControl

  if (!isSerializedFunction(options)) return { ...serializedControl, options }

  const deserializedOptions = deserializeFunction(options)

  return { ...serializedControl, options: deserializedOptions }
}

type SerializedTextStyleControl<_T = TextStylePropControllerData> = {
  type: typeof PropControllerTypes.TextStyle
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
  preset?: TextStylePropControllerData
  label?: string
  hidden?: boolean
}

type DeserializedTextStyleControl<_T = TextStylePropControllerData> = {
  type: typeof PropControllerTypes.TextStyle
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
  type: typeof PropControllerTypes.Image
  options: SerializedConfig<ImageControlConfig>
}

function serializeImageControl(control: ImageControl): [SerializedImageControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedImageControl<_T = ImageControlValue> = {
  type: typeof PropControllerTypes.Image
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
  type: typeof DELETED_PROP_CONTROLLER_TYPES.RichText
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
  type: typeof DELETED_PROP_CONTROLLER_TYPES.RichText
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
      | Descriptor<typeof GapX>
      | GapYDescriptor<T>
      | Descriptor<typeof ResponsiveNumber>
      | CheckboxControl<T>
      | ResponsiveColorDescriptor<T>
      | NumberDescriptor<T>
      | Descriptor<typeof ResponsiveIconRadioGroup>
      | Descriptor<typeof ResponsiveSelect>
      | ResponsiveLengthDescriptor<T>
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
  | SerializedControlDef<typeof GapX>
  | SerializedGapYControl<T>
  | SerializedControlDef<typeof ResponsiveNumber>
  | SerializedCheckboxControl<T>
  | SerializedResponsiveColorControl<T>
  | SerializedNumberControl<T>
  | SerializedControlDef<typeof ResponsiveIconRadioGroup>
  | SerializedControlDef<typeof ResponsiveSelect>
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
      | Descriptor<typeof GapX>
      | GapYDescriptor<T>
      | Descriptor<typeof ResponsiveNumber>
      | CheckboxControl<T>
      | ResponsiveColorDescriptor<T>
      | NumberDescriptor<T>
      | Descriptor<typeof ResponsiveIconRadioGroup>
      | Descriptor<typeof ResponsiveSelect>
      | ResponsiveLengthDescriptor<T>
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
  | DeserializedControlDef<typeof GapX>
  | DeserializedGapYControl<T>
  | DeserializedControlDef<typeof ResponsiveNumber>
  | DeserializedCheckboxControl<T>
  | DeserializedResponsiveColorControl<T>
  | DeserializedNumberControl<T>
  | DeserializedControlDef<typeof ResponsiveIconRadioGroup>
  | DeserializedControlDef<typeof ResponsiveSelect>
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

export type DeserializedPanelControl<T extends Data = Data> = Extract<
  DeserializedControl<T>,
  { type: PanelControlType }
>

type DeserializedPanelControlValueType<T extends DeserializedPanelControl> =
  T extends DeserializedPanelControl<infer U> ? U : never

export function serializeControl<T extends Data>(
  control: Control<T>,
): [SerializedControl<T>, Transferable[]] {
  switch (control.type) {
    case PropControllerTypes.Checkbox:
      return serializeCheckboxControl(control)

    case DELETED_PROP_CONTROLLER_TYPES.List:
      return serializeListControl(control)

    case DELETED_PROP_CONTROLLER_TYPES.Shape:
      return serializeShapeControl(control)

    case DELETED_PROP_CONTROLLER_TYPES.Typeahead:
      return serializeTypeaheadControl(control)

    case PropControllerTypes.GapX:
      return serializeControlDef<typeof GapX>(control)

    case PropControllerTypes.GapY:
      return serializeGapYControl(control)

    case PropControllerTypes.ResponsiveColor:
      return serializeResponsiveColorControl(control)

    case PropControllerTypes.ResponsiveNumber:
      return serializeControlDef<typeof ResponsiveNumber>(control)

    case PropControllerTypes.Number:
      return serializeNumberControl(control)

    case PropControllerTypes.ResponsiveIconRadioGroup:
      return serializeControlDef<typeof ResponsiveIconRadioGroup>(control)

    case PropControllerTypes.ResponsiveSelect:
      return serializeControlDef<typeof ResponsiveSelect>(control)

    case PropControllerTypes.ResponsiveLength:
      return serializeResponsiveLengthControl(control)

    case PropControllerTypes.Date:
      return serializeDateControl(control)

    case PropControllerTypes.Link:
      return serializeLinkControl(control)

    case PropControllerTypes.TextInput:
      return serializeTextInputControl(control)

    case PropControllerTypes.TextStyle:
      return serializeTextStyleControl(control)

    case PropControllerTypes.Image:
      return serializeImageControl(control)

    case DELETED_PROP_CONTROLLER_TYPES.RichText:
      return serializeRichTextControl(control)

    case RichTextV2ControlType:
      return serializeRichTextControlV2(control)

    case StyleV2ControlType:
      return serializeStyleV2Control(control)

    case ComboboxControlType:
      return serializeComboboxControlDefinition(control)

    case ShapeControlType:
      return serializeShapeControlDefinition(control)

    case ListControlType:
      return serializeListControlDefinition(control)

    default:
      return [control, []]
  }
}

export function deserializeControl<T extends Data>(
  serializedControl: SerializedControl<T>,
): DeserializedControl<T> {
  switch (serializedControl.type) {
    case PropControllerTypes.Checkbox:
      return deserializeCheckboxControl(serializedControl)

    case DELETED_PROP_CONTROLLER_TYPES.List:
      return deserializeListControl(serializedControl)

    case DELETED_PROP_CONTROLLER_TYPES.Shape:
      return deserializeShapeControl(serializedControl)

    case DELETED_PROP_CONTROLLER_TYPES.Typeahead:
      return deserializeTypeaheadControl(serializedControl)

    case PropControllerTypes.GapX:
      return deserializeControlDef<typeof GapX>(serializedControl)

    case PropControllerTypes.GapY:
      return deserializeGapYControl(serializedControl)

    case PropControllerTypes.ResponsiveColor:
      return deserializeResponsiveColorControl(serializedControl)

    case PropControllerTypes.ResponsiveNumber:
      return deserializeControlDef<typeof ResponsiveNumber>(serializedControl)

    case PropControllerTypes.Number:
      return deserializeNumberControl(serializedControl)

    case PropControllerTypes.ResponsiveIconRadioGroup:
      return deserializeControlDef<typeof ResponsiveIconRadioGroup>(serializedControl)

    case PropControllerTypes.ResponsiveSelect:
      return deserializeControlDef<typeof ResponsiveSelect>(serializedControl)

    case PropControllerTypes.ResponsiveLength:
      return deserializeResponsiveLengthControl(serializedControl)

    case PropControllerTypes.Date:
      return deserializeDateControl(serializedControl)

    case PropControllerTypes.Link:
      return deserializeLinkControl(serializedControl)

    case PropControllerTypes.TextInput:
      return deserializeTextInputControl(serializedControl)

    case PropControllerTypes.TextStyle:
      return deserializeTextStyleControl(serializedControl)

    case PropControllerTypes.Image:
      return deserializeImageControl(serializedControl)

    case DELETED_PROP_CONTROLLER_TYPES.RichText:
      return deserializeRichTextControl(serializedControl)

    case RichTextV2ControlType:
      return deserializeRichTextControlV2(serializedControl)

    case StyleV2ControlType:
      return deserializeStyleV2Control(serializedControl)

    case ComboboxControlType:
      return deserializeComboboxControlDefinition(serializedControl)

    case ShapeControlType:
      return deserializeShapeControlDefinition(serializedControl)

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
