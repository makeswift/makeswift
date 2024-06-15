declare const SerializedFunctionTag: unique symbol

type AnyFunction = (...args: any) => any

export type SerializedFunction<T extends AnyFunction> = MessagePort & {
  readonly [SerializedFunctionTag]: T
}

type SerializedFunctionReturnType<T extends AnyFunction> = Awaited<ReturnType<T>>

export type DeserializedFunction<T extends AnyFunction> = (
  ...args: Parameters<T>
) => Promise<SerializedFunctionReturnType<T>>

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

export function deserializeFunction<T extends AnyFunction>(
  serializedFunction: SerializedFunction<T>,
): DeserializedFunction<T> {
  type Result = SerializedFunctionReturnType<T>
  type ResultMessageEvent = MessageEvent<[CallID, Result]>
  type ResolveCallPromise = (value: Result | PromiseLike<Result>) => void

  let nextCallId = 0
  const calls = new Map<CallID, ResolveCallPromise>()

  serializedFunction.onmessage = ({ data: [callId, result] }: ResultMessageEvent) => {
    calls.get(callId)?.(result)

    calls.delete(callId)
  }

  return function deserializedFunction(...args) {
    return new Promise(resolve => {
      const callId = nextCallId++

      calls.set(callId, resolve)

      serializedFunction.postMessage([callId, args])
    })
  }
}
