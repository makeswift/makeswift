// utils.test.ts

import { canonicalize } from './canonicalize'

describe('canonicalize', () => {
  test('should handle primitive values', () => {
    expect(canonicalize(42)).toBe('42')
    expect(canonicalize('Hello')).toBe('"Hello"')
    expect(canonicalize(true)).toBe('true')
    expect(canonicalize(null)).toBe('null')
  })

  test('should handle arrays', () => {
    expect(canonicalize([1, 2, 3])).toBe('[1,2,3]')
    expect(canonicalize(['a', 'b', 'c'])).toBe('["a","b","c"]')
    expect(canonicalize([true, false, null])).toBe('[true,false,null]')
  })

  test('should handle objects with sorted keys', () => {
    const obj = { b: 1, a: 2 }
    expect(canonicalize(obj)).toBe('{"a":2,"b":1}')
  })

  test('should handle nested objects and arrays', () => {
    const data = {
      z: [3, 2, 1],
      a: { y: 'yes', x: 'no' },
    }
    expect(canonicalize(data)).toBe('{"a":{"x":"no","y":"yes"},"z":[3,2,1]}')
  })

  test('should handle identical objects with different key orders', () => {
    const obj1 = { name: 'Alice', age: 30 }
    const obj2 = { age: 30, name: 'Alice' }

    expect(canonicalize(obj1)).toBe(canonicalize(obj2))
  })

  test('should handle complex nested structures', () => {
    const complexData = {
      users: [
        { id: 1, roles: ['admin', 'user'] },
        { id: 2, roles: ['user'] },
      ],
      config: {
        theme: 'dark',
        layout: 'grid',
      },
    }

    const expectedString =
      '{"config":{"layout":"grid","theme":"dark"},"users":[{"id":1,"roles":["admin","user"]},{"id":2,"roles":["user"]}]}'

    expect(canonicalize(complexData)).toBe(expectedString)
  })
})
