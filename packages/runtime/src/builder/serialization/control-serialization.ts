import {
  GapXDescriptor,
  GapXPropControllerData,
  ResponsiveLengthOptions,
  ResponsiveLengthPropControllerData,
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
} from '../../controls'
import {
  Data,
  Device,
  Gap,
  GapYDescriptor as GapYControl,
  GapYValue as GapYControlValue,
  ImageDescriptor as ImageControl,
  ImageValue as ImageControlValue,
  ResponsiveNumberDescriptor as ResponsiveNumberControl,
  ResponsiveNumberValue as ResponsiveNumberControlValue,
  ResponsiveIconRadioGroupDescriptor as ResponsiveIconRadioGroupControl,
  ResponsiveIconRadioGroupValue as ResponsiveIconRadioGroupControlValue,
  ResponsiveSelectDescriptor as ResponsiveSelectControl,
  ResponsiveSelectValue as ResponsiveSelectControlValue,
  RichTextDescriptor as RichTextControl,
  RichTextValue as RichTextControlValue,
  TextInputDescriptor as TextInputControl,
  TextInputValue as TextInputControlValue,
  PanelDescriptorType as PanelControlType,
  PropControllerDescriptor as Control,
  Props as Controls,
} from '../../prop-controllers'
import {
  IconRadioGroupOption,
  SelectLabelOrientation,
  SelectOption,
} from '../../prop-controllers/descriptors'
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
} from '@makeswift/prop-controllers'

type SerializedConfig<T> =
  | T
  | SerializedFunction<(props: Record<string, unknown>, deviceMode: Device) => T>

type DeserializedConfig<T> =
  | T
  | DeserializedFunction<(props: Record<string, unknown>, deviceMode: Device) => T>

type GapXControlConfig = {
  preset?: GapXPropControllerData
  label?: string
  defaultValue?: Gap
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}

type SerializedGapXControl<_T = GapXPropControllerData> = {
  type: typeof PropControllerTypes.GapX
  options: SerializedConfig<GapXControlConfig>
}

function serializeGapXControl(control: GapXDescriptor): [SerializedGapXControl, Transferable[]] {
  const { options } = control

  if (typeof options !== 'function') return [{ ...control, options }, []]

  const serializedOptions = serializeFunction(options)

  return [{ ...control, options: serializedOptions }, [serializedOptions]]
}

type DeserializedGapXControl<_T = GapXPropControllerData> = {
  type: typeof PropControllerTypes.GapX
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
      | GapXDescriptor<T>
      | GapYControl<T>
      | ResponsiveNumberControl<T>
      | CheckboxControl<T>
      | ResponsiveColorDescriptor<T>
      | NumberDescriptor<T>
      | ResponsiveIconRadioGroupControl<
          T extends ResponsiveIconRadioGroupControlValue ? T : ResponsiveIconRadioGroupControlValue
        >
      | ResponsiveSelectControl<
          T extends ResponsiveSelectControlValue ? T : ResponsiveSelectControlValue
        >
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

export type DeserializedControl<T extends Data = Data> =
  | Exclude<
      Control<T>,
      | GapXDescriptor<T>
      | GapYControl<T>
      | ResponsiveNumberControl<T>
      | CheckboxControl<T>
      | ResponsiveColorDescriptor<T>
      | NumberDescriptor<T>
      | ResponsiveIconRadioGroupControl<
          T extends ResponsiveIconRadioGroupControlValue ? T : ResponsiveIconRadioGroupControlValue
        >
      | ResponsiveSelectControl<
          T extends ResponsiveSelectControlValue ? T : ResponsiveSelectControlValue
        >
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

export type DeserializedPanelControl<T extends Data = Data> = Extract<
  DeserializedControl<T>,
  { type: PanelControlType }
>

export function serializeControl<T extends Data>(
  control: Control<T>,
): [SerializedControl<T>, Transferable[]] {
  switch (control.type) {
    case PropControllerTypes.Checkbox:
      return serializeCheckboxControl(control)

    case PropControllerTypes.GapX:
      return serializeGapXControl(control)

    case Controls.Types.GapY:
      return serializeGapYControl(control)

    case PropControllerTypes.ResponsiveColor:
      return serializeResponsiveColorControl(control)

    case Controls.Types.ResponsiveNumber:
      return serializeResponsiveNumberControl(control)

    case PropControllerTypes.Number:
      return serializeNumberControl(control)

    case Controls.Types.ResponsiveIconRadioGroup:
      return serializeResponsiveIconRadioGroupControl(control)

    case Controls.Types.ResponsiveSelect:
      return serializeResponsiveSelectControl(control)

    case PropControllerTypes.ResponsiveLength:
      return serializeResponsiveLengthControl(control)

    case PropControllerTypes.Date:
      return serializeDateControl(control)

    case PropControllerTypes.Link:
      return serializeLinkControl(control)

    case Controls.Types.TextInput:
      return serializeTextInputControl(control)

    case PropControllerTypes.TextStyle:
      return serializeTextStyleControl(control)

    case Controls.Types.Image:
      return serializeImageControl(control)

    case Controls.Types.RichText:
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

    case PropControllerTypes.GapX:
      return deserializeGapXControl(serializedControl)

    case Controls.Types.GapY:
      return deserializeGapYControl(serializedControl)

    case PropControllerTypes.ResponsiveColor:
      return deserializeResponsiveColorControl(serializedControl)

    case Controls.Types.ResponsiveNumber:
      return deserializeResponsiveNumberControl(serializedControl)

    case PropControllerTypes.Number:
      return deserializeNumberControl(serializedControl)

    case Controls.Types.ResponsiveIconRadioGroup:
      return deserializeResponsiveIconRadioGroupControl(serializedControl)

    case Controls.Types.ResponsiveSelect:
      return deserializeResponsiveSelectControl(serializedControl)

    case PropControllerTypes.ResponsiveLength:
      return deserializeResponsiveLengthControl(serializedControl)

    case PropControllerTypes.Date:
      return deserializeDateControl(serializedControl)

    case PropControllerTypes.Link:
      return deserializeLinkControl(serializedControl)

    case Controls.Types.TextInput:
      return deserializeTextInputControl(serializedControl)

    case PropControllerTypes.TextStyle:
      return deserializeTextStyleControl(serializedControl)

    case Controls.Types.Image:
      return deserializeImageControl(serializedControl)

    case Controls.Types.RichText:
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
