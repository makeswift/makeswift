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

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest

  describe.concurrent('serializeFunction & deserializeFunction', () => {
    test('simple call', async () => {
      // Arrange
      const add = deserializeFunction(serializeFunction((a, b) => a + b))

      // Act
      const result = await add(2, 2)

      // Assert
      expect(result).toBe(4)
    })

    test('multiple synchronous calls', async () => {
      // Arrange
      const add = deserializeFunction(serializeFunction((a, b) => a + b))

      // Act
      const results = await Promise.all(Array.from({ length: 5 }, (_, i) => add(1, i)))

      // Assert
      expect(results).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe.concurrent('isSerializedFunction', () => {
    test('trivial case', () => {
      // Arrange
      const add = serializeFunction((a, b) => a + b)

      // Act
      const result = isSerializedFunction(add)

      // Assert
      expect(result).toBe(true)
    })

    test('false positive', () => {
      // Arrange
      const add = (a: number, b: number) => a + b

      // Act
      const result = isSerializedFunction(add)

      // Assert
      expect(result).toBe(false)
    })
  })
}
