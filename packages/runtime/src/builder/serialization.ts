import {
  type Data,
  ControlDefinition as UnifiedControlDefinition,
  type SerializedRecord,
  DeserializationPlugin,
  deserializeObject,
} from '@makeswift/controls'

import {
  type SerializedLegacyControl,
  type DeserializedLegacyControl,
  serializeLegacyControl,
  deserializeLegacyControl,
} from '../prop-controllers/serialization'

import { type Descriptor, isLegacyDescriptor } from '../prop-controllers/descriptors'

import { deserializeControl as deserializeUnifiedControl } from '../controls/serialization/base'
import {
  type DeserializedFunction,
  type SerializedFunction,
  ClientMessagePortSerializationVisitor,
  functionDeserializationPlugin,
} from '../controls/serialization/message-port'

import {
  type DeserializeControlRecordsOptions,
  deserializeControlRecords,
} from '../controls/serialization'

export * from '../prop-controllers/serialization'

export type SerializedControl<T extends Data = Data> = SerializedLegacyControl<T> | SerializedRecord

export type DeserializedControl<T extends Data = Data> =
  | DeserializedLegacyControl<T>
  | UnifiedControlDefinition

export function serializeControl<T extends Data>(
  control: Descriptor<T>,
): [SerializedControl<T>, Transferable[]] {
  if (isLegacyDescriptor(control)) {
    return serializeLegacyControl(control)
  }

  const messagePortVisitor = new ClientMessagePortSerializationVisitor()
  const serializedControl = control.accept(messagePortVisitor)
  return [serializedControl, messagePortVisitor.getTransferables()]
}

function isSerializedLegacyControl<T extends Data>(
  control: SerializedControl<T>,
): control is SerializedLegacyControl<T> {
  return 'options' in control
}

export type DeserializeControlOptions = {
  plugins?: DeserializationPlugin<any>[]
}

export function deserializeControl<T extends Data>(
  serializedControl: SerializedControl<T>,
  options?: DeserializeControlOptions,
): DeserializedControl<T> {
  if (isSerializedLegacyControl(serializedControl)) {
    // Parity with controls deserialization logic below: "preprocess" serialized
    // legacy controls if the caller provided custom deserialization plugins
    const record = options?.plugins
      ? deserializeObject(serializedControl, options?.plugins)
      : serializedControl
    return deserializeLegacyControl(record as SerializedLegacyControl<T>)
  }

  const plugins = [functionDeserializationPlugin, ...(options?.plugins ?? [])]
  return deserializeUnifiedControl(serializedControl, { plugins })
}

export function serializeControls(
  controls: Record<string, Descriptor>,
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
  serializedControls: Record<string, unknown>,
  { onError, plugins }: DeserializeControlRecordsOptions = {},
): Record<string, DeserializedControl> {
  return deserializeControlRecords<DeserializedControl>(
    serializedControls,
    (serializedControl, options) => deserializeControl(serializedControl, options),
    { onError, plugins },
  )
}

type AnyFunction = (...args: any[]) => any

export type Serialize<T> = T extends AnyFunction
  ? SerializedFunction<T>
  : T extends Record<string, unknown>
    ? { [K in keyof T]: Serialize<T[K]> }
    : T

export type Deserialize<T> =
  T extends SerializedFunction<infer U>
    ? DeserializedFunction<U>
    : T extends Record<string, unknown>
      ? { [K in keyof T]: Deserialize<T[K]> }
      : T
