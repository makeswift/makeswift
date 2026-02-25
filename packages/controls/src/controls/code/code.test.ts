import { testDefinition, testResolveValue } from '../../testing/test-definition'

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

    test('supports languages config', () => {
      expect(
        Code({
          label: 'CSS Code',
          languages: ['css', 'html'],
          defaultValue: 'body { color: red; }',
        }),
      ).toMatchSnapshot()
    })

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
    assignTest(Code({ defaultValue: 'text' as string }))
    assignTest(Code({ label: 'Code', defaultValue: undefined }))
    assignTest(Code({ label: undefined, defaultValue: undefined }))
    assignTest(Code({ languages: ['javascript', 'typescript'] }))
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
  testDefinition(def, values, invalidValues)
  testResolveValue(def, values)
})
