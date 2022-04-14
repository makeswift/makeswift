import {
  CheckboxDescriptor as CheckboxControl,
  CheckboxValue as CheckboxControlValue,
  Data,
  Device,
  Gap,
  GapXDescriptor as GapXControl,
  GapXValue as GapXControlValue,
  GapYDescriptor as GapYControl,
  GapYValue as GapYControlValue,
  ListDescriptor as ListControl,
  ListOptions as ListControlConfig,
  ListValue as ListControlValue,
  ResponsiveNumberDescriptor as ResponsiveNumberControl,
  ResponsiveNumberValue as ResponsiveNumberControlValue,
  ShapeDescriptor as ShapeControl,
  ShapeValue as ShapeControlValue,
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
    >
  | SerializedListControl<T extends ListControlValue ? T : ListControlValue>
  | SerializedShapeControl<T extends ShapeControlValue ? T : ShapeControlValue, any>
  | SerializedTypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>
  | SerializedGapXControl<T>
  | SerializedGapYControl<T>
  | SerializedResponsiveNumberControl<T>
  | SerializedCheckboxControl<T>

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
    >
  | DeserializedListControl<T extends ListControlValue ? T : ListControlValue>
  | DeserializedShapeControl<T extends ShapeControlValue ? T : ShapeControlValue, any>
  | DeserializedTypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>
  | DeserializedGapXControl<T>
  | DeserializedGapYControl<T>
  | DeserializedResponsiveNumberControl<T>
  | DeserializedCheckboxControl<T>

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

    case Controls.Types.ResponsiveNumber:
      return serializeResponsiveNumberControl(control)

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

    case Controls.Types.ResponsiveNumber:
      return deserializeResponsiveNumberControl(serializedControl)

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
