import { expectTypeOf } from 'expect-type'

import { partition, partitionRecord } from '../partition'

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

describe('partition', () => {
  it('splits the array into two based on a predicate', () => {
    const array = [1, 2, 3, 4, 5]
    const [even, odd] = partition(array, x => x % 2 === 0)
    expect(even).toStrictEqual([2, 4])
    expect(odd).toStrictEqual([1, 3, 5])
  })

  it('correctly handles an always-false predicate', () => {
    const array = [1, 2, 3, 4, 5]
    const [overTen, underTen] = partition(array, x => x > 10)
    expect(overTen).toStrictEqual([])
    expect(underTen).toStrictEqual(array)
  })

  it('correctly handles an always-true predicate', () => {
    const array = [1, 2, 3, 4, 5]
    const [underTen, overTen] = partition(array, x => x < 10)
    expect(underTen).toStrictEqual(array)
    expect(overTen).toStrictEqual([])
  })

  it('correctly types the resulting arrays if a predicate includes a type assertion', () => {
    const array = [1, 'hello', 3, 'world', 5]
    const [numbers, strings] = partition(array, isNumber)

    expectTypeOf(numbers).toEqualTypeOf<number[]>()
    expectTypeOf(strings).toEqualTypeOf<string[]>()

    expect(numbers).toStrictEqual([1, 3, 5])
    expect(strings).toStrictEqual(['hello', 'world'])
  })
})

describe('partitionRecord', () => {
  it('splits the record into two based on a predicate', () => {
    const record = { one: 1, two: 2, three: 3, four: 4, five: 5 }
    const [even, odd] = partitionRecord(record, x => x % 2 === 0)
    expect(even).toStrictEqual({ two: 2, four: 4 })
    expect(odd).toStrictEqual({ one: 1, three: 3, five: 5 })
  })

  it('correctly handles an always-false predicate', () => {
    const record = { one: 1, two: 2, three: 3, four: 4, five: 5 }
    const [overTen, underTen] = partitionRecord(record, x => x > 10)
    expect(overTen).toStrictEqual({})
    expect(underTen).toStrictEqual(record)
  })

  it('correctly handles an always-true predicate', () => {
    const record = { one: 1, two: 2, three: 3, four: 4, five: 5 }
    const [underTen, overTen] = partitionRecord(record, x => x < 10)
    expect(underTen).toStrictEqual(record)
    expect(overTen).toStrictEqual({})
  })

  it('correctly types the resulting records if a predicate includes a type assertion', () => {
    const record = { one: 1, greeting: 'hello', three: 3, subject: 'world', five: 5 }
    const [numbers, strings] = partitionRecord(record, isNumber)

    expectTypeOf(numbers).toEqualTypeOf<Record<string, number>>()
    expectTypeOf(strings).toEqualTypeOf<Record<string, string>>()

    expect(numbers).toStrictEqual({ one: 1, three: 3, five: 5 })
    expect(strings).toStrictEqual({ greeting: 'hello', subject: 'world' })
  })
})
