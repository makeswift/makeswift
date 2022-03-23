import {
  Data,
  ListDescriptor as ListControl,
  ListOptions as ListControlConfig,
  ListValue as ListControlValue,
  PanelDescriptor,
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
  type: PanelDescriptor<T>
  label?: string
  getItemLabel?: SerializedFunction<Exclude<ListControlConfig<T>['getItemLabel'], undefined>>
  preset?: ListControlValue<T>
  defaultValue?: ListControlValue<T>
}

type SerializedListControl<T extends ListControlValue = ListControlValue> = {
  type: typeof Controls.Types.List
  options: SerializedListControlConfig<T[number]['value']>
}

function serializeListControl<T extends Data>(
  control: ListControl<ListControlValue<T>>,
): [SerializedListControl<ListControlValue<T>>, Transferable[]] {
  const { getItemLabel } = control.options

  const serializedGetItemLabel = getItemLabel && serializeFunction(getItemLabel)

  return [
    { ...control, options: { ...control.options, getItemLabel: serializedGetItemLabel } },
    serializedGetItemLabel == null ? [] : [serializedGetItemLabel],
  ]
}

type DeserializedListControlConfig<T extends Data> = {
  type: PanelDescriptor<T>
  label?: string
  getItemLabel?: DeserializedFunction<Exclude<ListControlConfig<T>['getItemLabel'], undefined>>
  preset?: ListControlValue<T>
  defaultValue?: ListControlValue<T>
}

type DeserializedListControl<T extends ListControlValue = ListControlValue> = {
  type: typeof Controls.Types.List
  options: DeserializedListControlConfig<T[number]['value']>
}

function deserializeListControl<T extends Data>(
  serializedControl: SerializedListControl<ListControlValue<T>>,
): DeserializedListControl<ListControlValue<T>> {
  const { getItemLabel } = serializedControl.options

  const deserializedGetItemLabel = getItemLabel && deserializeFunction(getItemLabel)

  return {
    ...serializedControl,
    options: { ...serializedControl.options, getItemLabel: deserializedGetItemLabel },
  }
}

export type SerializedControl = Exclude<Control, ListControl> | SerializedListControl

export type DeserializedControl = Exclude<Control, ListControl> | DeserializedListControl

function serializeControl(control: Control): [SerializedControl, Transferable[]] {
  switch (control.type) {
    case Controls.Types.List:
      return serializeListControl(control)

    default:
      return [control, []]
  }
}

function deserializeControl(serializedControl: SerializedControl): DeserializedControl {
  switch (serializedControl.type) {
    case Controls.Types.List:
      return deserializeListControl(serializedControl)

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
