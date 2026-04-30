import { testDefinition } from '../../testing/test-definition'

import { unstable_Code, unstable_CodeDefinition } from './code'

describe('Code', () => {
  describe('constructor', () => {
    test.each(['console.log("hello")', '<div>hi</div>', undefined])(
      'call with default value `%s` returns versioned definition',
      (value) => {
        expect(
          unstable_Code({
            label: 'Code',
            defaultValue: value,
          }),
        ).toMatchSnapshot()
      },
    )

    test('disallows extraneous properties', () => {
      unstable_Code({
        label: undefined,
        defaultValue: undefined,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: unstable_CodeDefinition) {}
    assignTest(unstable_Code())
    assignTest(unstable_Code({ label: 'Code' }))
    assignTest(unstable_Code({ defaultValue: '<div>hello</div>' }))
    assignTest(unstable_Code({ defaultValue: 'text' }))
    assignTest(unstable_Code({ label: 'Code', defaultValue: undefined }))
    assignTest(unstable_Code({ label: undefined, defaultValue: undefined }))
  })
})

describe.each([
  [
    unstable_Code({ defaultValue: 'console.log("hi")', label: 'visible' }),
    ['const x = 1', 'body { color: red; }'],
  ],
  [
    unstable_Code({ label: 'Code' }),
    ['<div>hello</div>', '.class { margin: 0; }', undefined],
  ],
])('Code', (def, values) => {
  const invalidValues = [null, false, 5, []]
  testDefinition(def, values, invalidValues)
})

describe('Code resolveValue', () => {
  test('resolves v1 data to { value }', () => {
    const def = unstable_Code({ label: 'Code' })
    const data = def.toData('const x = 1')
    expect(def.resolveValue(data).readStable()).toEqual({
      value: 'const x = 1',
    })
  })

  test('resolves unversioned (plain string) data', () => {
    const def = unstable_Code({ label: 'Code' })
    expect(def.resolveValue('print("hi")').readStable()).toEqual({
      value: 'print("hi")',
    })
  })

  test('resolves undefined data to the default value', () => {
    const def = unstable_Code({ defaultValue: 'fallback' })
    expect(def.resolveValue(undefined).readStable()).toEqual({
      value: 'fallback',
    })
  })

  test('resolves undefined data to undefined when no default is set', () => {
    const def = unstable_Code()
    expect(def.resolveValue(undefined).readStable()).toBeUndefined()
  })

  test('readStable returns the same reference across repeated calls', () => {
    const def = unstable_Code({ defaultValue: 'hello' })
    const resolvable = def.resolveValue(undefined)
    expect(resolvable.readStable()).toBe(resolvable.readStable())
  })
})
