import {
  DeserializationPlugin,
  type AnyFunction,
  type SerializedFunctionReturnType,
  type DeserializedFunction,
} from '@makeswift/controls'

export { type DeserializedFunction } from '@makeswift/controls'

declare const SerializedFunctionTag: unique symbol

type ResolveCallPromise<T extends AnyFunction> = (value: SerializedFunctionReturnType<T>) => void
type RejectCallPromise = (error: unknown) => void

type OnMessageHandler<T extends AnyFunction> = MessagePort['onmessage'] & {
  newCall?(resolve: ResolveCallPromise<T>, reject: RejectCallPromise): number
}

export type SerializedFunction<T extends AnyFunction> = MessagePort & {
  onmessage: OnMessageHandler<T>
  readonly [SerializedFunctionTag]: T
}

export function isSerializedFunction(value: any): value is SerializedFunction<AnyFunction> {
  return value instanceof MessagePort
}

type CallID = number
type ErrorDescriptor = { message: string; name?: string }
type ReplyMessage<T extends AnyFunction> =
  | [CallID, 'resolve', SerializedFunctionReturnType<T>]
  | [CallID, 'reject', ErrorDescriptor]

function toErrorDescriptor(error: unknown): ErrorDescriptor {
  if (error instanceof Error) return { message: error.message, name: error.name }
  return { message: String(error) }
}

// Walks a plain object/array tree collecting any MessagePort found within it,
// since a reply carrying one (e.g. a nested serialized function/control) must
// list it as a transferable or postMessage throws DataCloneError.
function collectTransferables(value: unknown, seen: Set<unknown> = new Set()): Transferable[] {
  if (value == null || typeof value !== 'object') return []
  if (isSerializedFunction(value)) return [value]
  if (seen.has(value)) return []
  seen.add(value)

  if (Array.isArray(value)) return value.flatMap(item => collectTransferables(item, seen))
  if (value.constructor === Object) {
    return Object.values(value).flatMap(item => collectTransferables(item, seen))
  }
  return []
}

export function serializeFunction<T extends AnyFunction>(
  func: T,
  hostPortRegistry?: MessagePort[],
): SerializedFunction<T> {
  type CallMessageEvent = MessageEvent<[CallID, Parameters<T>]>

  const messageChannel = new MessageChannel()

  messageChannel.port1.onmessage = ({ data: [callId, args] }: CallMessageEvent) => {
    Promise.resolve()
      .then(() => func.apply(null, args))
      .then(
        result => {
          const reply: ReplyMessage<T> = [callId, 'resolve', result]
          messageChannel.port1.postMessage(reply, collectTransferables(result))
        },
        (error: unknown) => {
          const reply: ReplyMessage<T> = [callId, 'reject', toErrorDescriptor(error)]
          messageChannel.port1.postMessage(reply)
        },
      )
  }

  hostPortRegistry?.push(messageChannel.port1)

  return messageChannel.port2 as SerializedFunction<T>
}

function onmessageHandler<T extends AnyFunction>(): OnMessageHandler<T> {
  type ResultMessageEvent = MessageEvent<ReplyMessage<T>>
  let nextCallId = 0
  const calls = new Map<CallID, { resolve: ResolveCallPromise<T>; reject: RejectCallPromise }>()

  const result: OnMessageHandler<T> = ({ data }: ResultMessageEvent) => {
    const [callId, status, payload] = data
    const call = calls.get(callId)
    calls.delete(callId)
    if (call == null) return

    if (status === 'reject') {
      const error = new Error(payload.message)
      if (payload.name != null) error.name = payload.name
      call.reject(error)
    } else {
      call.resolve(payload)
    }
  }

  result.newCall = (resolve: ResolveCallPromise<T>, reject: RejectCallPromise) => {
    const callId = nextCallId++
    calls.set(callId, { resolve, reject })
    return callId
  }

  return result
}

export function deserializeFunction<T extends AnyFunction>(
  serializedFunction: SerializedFunction<T>,
): DeserializedFunction<T> {
  if (serializedFunction.onmessage == null) {
    serializedFunction.onmessage = onmessageHandler<T>()
  }

  return function deserializedFunction(...args) {
    return new Promise((resolve, reject) => {
      const { newCall } = serializedFunction.onmessage
      if (newCall == null) {
        throw new Error(
          `Deserialized function call failed: 'onmessage' handler is missing 'newCall' method`,
        )
      }

      const callId = newCall(resolve, reject)
      serializedFunction.postMessage([callId, args])
    })
  }
}

export const functionDeserializationPlugin: DeserializationPlugin<
  SerializedFunction<AnyFunction>,
  DeserializedFunction<AnyFunction>
> = {
  match: isSerializedFunction,
  deserialize: value => deserializeFunction(value),
}
