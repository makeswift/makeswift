import { testDefinition, testResolveValue } from '../../testing/test-definition'

import { unstable_Code, CodeDefinition } from './code'

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

    test('supports language config', () => {
      expect(
        unstable_Code({
          label: 'CSS Code',
          language: 'css',
          defaultValue: 'body { color: red; }',
        }),
      ).toMatchSnapshot()
    })

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
    function assignTest(_def: CodeDefinition) {}
    assignTest(unstable_Code())
    assignTest(unstable_Code({ label: 'Code' }))
    assignTest(unstable_Code({ defaultValue: '<div>hello</div>' }))
    assignTest(unstable_Code({ defaultValue: 'text' }))
    assignTest(unstable_Code({ label: 'Code', defaultValue: undefined }))
    assignTest(unstable_Code({ label: undefined, defaultValue: undefined }))
    assignTest(unstable_Code({ language: 'typescript' }))
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
  testResolveValue(def, values)
})
