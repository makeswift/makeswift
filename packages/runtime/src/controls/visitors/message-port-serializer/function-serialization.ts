import {
  DeserializationPlugin,
  type AnyFunction,
  type SerializedFunctionReturnType,
  type DeserializedFunction,
} from '@makeswift/controls'

declare const SerializedFunctionTag: unique symbol

type ResolveCallPromise<T extends AnyFunction> = (value: SerializedFunctionReturnType<T>) => void

type OnMessageHandler<T extends AnyFunction> = MessagePort['onmessage'] & {
  newCall?(resolve: ResolveCallPromise<T>): number
}

export type SerializedFunction<T extends AnyFunction> = MessagePort & {
  onmessage: OnMessageHandler<T>
  readonly [SerializedFunctionTag]: T
}

export function isSerializedFunction(value: any): value is SerializedFunction<AnyFunction> {
  return value instanceof MessagePort
}

type CallID = number

export function serializeFunction<T extends AnyFunction>(func: T): SerializedFunction<T> {
  type CallMessageEvent = MessageEvent<[CallID, Parameters<T>]>

  const messageChannel = new MessageChannel()

  messageChannel.port1.onmessage = ({ data: [callId, args] }: CallMessageEvent) => {
    Promise.resolve()
      .then(() => func.apply(null, args))
      .then(result => messageChannel.port1.postMessage([callId, result]))
  }

  return messageChannel.port2 as SerializedFunction<T>
}

function onmessageHandler<T extends AnyFunction>(): OnMessageHandler<T> {
  type ResultMessageEvent = MessageEvent<[CallID, SerializedFunctionReturnType<T>]>
  let nextCallId = 0
  const calls = new Map<CallID, ResolveCallPromise<T>>()

  const result: OnMessageHandler<T> = ({ data: [callId, result] }: ResultMessageEvent) => {
    calls.get(callId)?.(result)
    calls.delete(callId)
  }

  result.newCall = (resolve: ResolveCallPromise<T>) => {
    const callId = nextCallId++
    calls.set(callId, resolve)
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
    return new Promise(resolve => {
      const { newCall } = serializedFunction.onmessage
      if (newCall == null) {
        throw new Error(
          `Deserialized function call failed: 'onmessage' handler is missing 'newCall' method`,
        )
      }

      const callId = newCall(resolve)
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
