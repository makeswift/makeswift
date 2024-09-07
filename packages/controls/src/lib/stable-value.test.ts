import { StableValue } from './stable-value'

function Dependency() {
  let count = 0
  const subscribers = new Set<() => void>()

  return {
    count: () => count,
    subscribe: (onUpdate: () => void) => {
      subscribers.add(onUpdate)
      return () => subscribers.delete(onUpdate)
    },
    increment: () => {
      ++count
      subscribers.forEach((s) => s())
    },
  }
}

describe('StableValue', () => {
  test('`read` returns stable value if no deps', () => {
    let count = 0
    const value = StableValue({
      read: () => count,
    })

    const callback = jest.fn()
    value.subscribe(callback)

    expect(value.read()).toBe(0)
    ++count
    expect(value.read()).toBe(0)
    expect(callback).toHaveBeenCalledTimes(0)
  })

  test('calls `subscribe` callback, `read` returns new value when dependency changes', () => {
    const dependency = Dependency()

    let count = 0
    const value = StableValue({
      read: () => count + dependency.count(),
      deps: [dependency],
    })

    const callback = jest.fn()
    const unsubscribe = value.subscribe(callback)
    expect(value.read()).toBe(0)
    ++count
    expect(value.read()).toBe(0)
    dependency.increment()
    expect(callback).toHaveBeenCalledTimes(1)
    expect(value.read()).toBe(2)
    dependency.increment()
    expect(callback).toHaveBeenCalledTimes(2)
    expect(value.read()).toBe(3)

    unsubscribe()
    dependency.increment()
    expect(callback).toHaveBeenCalledTimes(2)
    expect(value.read()).toBe(3)
  })

  test('updated value can be read in the `subscribe` callback', () => {
    const dependency = Dependency()

    let count = 0
    const value = StableValue({
      read: () => count + dependency.count(),
      deps: [dependency],
    })

    const callback = jest.fn(() => {
      expect(value.read()).toBe(2)
    })

    value.subscribe(callback)

    expect(value.read()).toBe(0)
    ++count
    expect(value.read()).toBe(0)
    dependency.increment()
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
