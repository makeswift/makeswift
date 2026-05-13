import { testDefinition } from '../../testing/test-definition'

import { Code, CodeDefinition } from './code'

describe('Code', () => {
  describe('constructor', () => {
    test.each(['console.log("hello")', '<div>hi</div>', undefined])(
      'call with default value `%s` returns versioned definition',
      (value) => {
        expect(
          Code({
            label: 'Code',
            defaultValue: value,
          }),
        ).toMatchSnapshot()
      },
    )

    test('disallows extraneous properties', () => {
      Code({
        label: undefined,
        defaultValue: undefined,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: CodeDefinition) {}
    assignTest(Code())
    assignTest(Code({ label: 'Code' }))
    assignTest(Code({ defaultValue: '<div>hello</div>' }))
    assignTest(Code({ defaultValue: 'text' }))
    assignTest(Code({ label: 'Code', defaultValue: undefined }))
    assignTest(Code({ label: undefined, defaultValue: undefined }))
  })
})

describe.each([
  [
    Code({ defaultValue: 'console.log("hi")', label: 'visible' }),
    ['const x = 1', 'body { color: red; }'],
  ],
  [
    Code({ label: 'Code' }),
    ['<div>hello</div>', '.class { margin: 0; }', undefined],
  ],
])('Code', (def, values) => {
  const invalidValues = [null, false, 5, []]
  testDefinition(def, values, invalidValues, { skipV0Definition: true })
})

describe('Code resolveValue', () => {
  test('resolves v1 data to { value }', () => {
    const def = Code({ label: 'Code' })
    const data = def.toData('const x = 1')
    expect(def.resolveValue(data).readStable()).toEqual({
      value: 'const x = 1',
    })
  })

  test('resolves unversioned (plain string) data', () => {
    const def = Code({ label: 'Code' })
    expect(def.resolveValue('print("hi")').readStable()).toEqual({
      value: 'print("hi")',
    })
  })

  test('resolves undefined data to the default value', () => {
    const def = Code({ defaultValue: 'fallback' })
    expect(def.resolveValue(undefined).readStable()).toEqual({
      value: 'fallback',
    })
  })

  test('resolves undefined data to undefined when no default is set', () => {
    const def = Code()
    expect(def.resolveValue(undefined).readStable()).toBeUndefined()
  })

  test('readStable returns the same reference across repeated calls', () => {
    const def = Code({ defaultValue: 'hello' })
    const resolvable = def.resolveValue(undefined)
    expect(resolvable.readStable()).toBe(resolvable.readStable())
  })
})
