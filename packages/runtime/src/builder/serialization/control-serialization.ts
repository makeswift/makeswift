import {
  Data,
  ListDescriptor as ListControl,
  ListOptions as ListControlConfig,
  ListValue as ListControlValue,
  TypeaheadDescriptor as TypeaheadControl,
  TypeaheadOptions as TypeaheadControlConfig,
  TypeaheadValue as TypeaheadControlValue,
  PropControllerDescriptor as Control,
  Props as Controls,
} from '../../prop-controllers'
import {
  DeserializedFunction,
  deserializeFunction,
  SerializedFunction,
  serializeFunction,
} from './function-serialization'

type SerializedListControlConfig<T extends Data> = {
  type: SerializedControl<T>
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
      options: { ...control.options, type: serializedType, getItemLabel: serializedGetItemLabel },
    },
    transferables,
  ]
}

type DeserializedListControlConfig<T extends Data> = {
  type: DeserializedControl<T>
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

  const deserializedType = deserializeControl(type)
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

export type SerializedControl<T extends Data = Data> =
  | Exclude<
      Control<T>,
      | ListControl<T extends ListControlValue ? T : ListControlValue>
      | TypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>
    >
  | SerializedListControl<T extends ListControlValue ? T : ListControlValue>
  | SerializedTypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>

export type DeserializedControl<T extends Data = Data> =
  | Exclude<
      Control<T>,
      | ListControl<T extends ListControlValue ? T : ListControlValue>
      | TypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>
    >
  | DeserializedListControl<T extends ListControlValue ? T : ListControlValue>
  | DeserializedTypeaheadControl<T extends TypeaheadControlValue ? T : TypeaheadControlValue>

function serializeControl<T extends Data>(
  control: Control<T>,
): [SerializedControl<T>, Transferable[]] {
  switch (control.type) {
    case Controls.Types.List:
      return serializeListControl(control)

    case Controls.Types.Typeahead:
      return serializeTypeaheadControl(control)

    default:
      return [control, []]
  }
}

function deserializeControl<T extends Data>(
  serializedControl: SerializedControl<T>,
): DeserializedControl<T> {
  switch (serializedControl.type) {
    case Controls.Types.List:
      return deserializeListControl(serializedControl)

    case Controls.Types.Typeahead:
      return deserializeTypeaheadControl(serializedControl)

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
