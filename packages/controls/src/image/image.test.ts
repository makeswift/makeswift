import { Image } from './image'
import { testDefinition } from '../tests/test-definition'

import { type CopyContext, createReplacementContext } from '../context'
import {
  type ValueType,
  type ResolvedValueType,
  ControlDefinition,
} from '../control-definition'

import { Targets } from '../introspect'

const fakeImageUrl = 'https://example.com/image.jpg'

function testImageDefinition<Def extends ControlDefinition>(
  definition: Def,
  values: ValueType<Def>[],
  invalidValues: unknown[],
) {
  testDefinition(definition, values, invalidValues)

  describe('introspect file IDs', () => {
    test.each([
      { type: 'makeswift-file', id: 'fake-id', version: 1 },
      'fake-id',
    ])("returns data's `fileId`", (data) => {
      expect(definition.introspect(data, Targets.File)).toEqual(['fake-id'])
    })

    test.each([null, undefined])('gracefully handles %s', (value) => {
      expect(definition.introspect(value, Targets.File)).toEqual([])
    })
  })
}

describe('Image', () => {
  describe('constructor', () => {
    test.each([Image.Format.URL, Image.Format.WithDimensions, undefined])(
      'call with format `%s` returns versioned definition',
      (value) => {
        expect(Image({ label: 'Image', format: value })).toMatchSnapshot()
      },
    )

    test("definition's config type is derived from constructor's arguments", () => {
      // Assert
      Image({
        label: 'Image',
      }).config satisfies { label: string }

      Image({
        label: 'Image',
        format: Image.Format.URL,
      }).config satisfies { label: string; format: string }
    })

    describe("refines resolved value type based on ctor's `format`", () => {
      test(`format is ${undefined}`, () => {
        // Arrange
        const definition = Image({ label: 'color' })

        // Assert
        const value: string = 'test' as ResolvedValueType<typeof definition>
        expect(value).toBe('test')
      })

      test(`format is ${Image.Format.URL}`, () => {
        // Arrange
        const definition = Image({ label: 'color', format: Image.Format.URL })

        // Assert
        const value: string = 'test' as ResolvedValueType<typeof definition>
        expect(value).toBe('test')
      })

      test(`format is ${Image.Format.WithDimensions}`, () => {
        // Arrange
        const definition = Image({
          label: 'color',
          format: Image.Format.WithDimensions,
        })

        // Assert
        const value: {
          url: string
          dimensions: {
            width: number
            height: number
          }
        } = {
          url: 'test',
          dimensions: { width: 100, height: 100 },
        } as ResolvedValueType<typeof definition>
        expect(value).toEqual({
          url: 'test',
          dimensions: { width: 100, height: 100 },
        })
      })
    })
  })

  describe('copyData', () => {
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        fileIds: { 'fake-file-id': '[fake-file-id-replaced]' },
      }),
      copyElement: (node) => node,
    }

    test('replaces `fileId` found in replacement context', () => {
      // Act
      const v1Result = Image().copyData(
        { type: 'makeswift-file', id: 'fake-file-id', version: 1 },
        context,
      )

      const v0Result = Image().copyData('fake-file-id', context)

      // Assert
      expect(v1Result).toEqual({
        type: 'makeswift-file',
        id: '[fake-file-id-replaced]',
        version: 1,
      })
      expect(v0Result).toEqual('[fake-file-id-replaced]')
    })

    test('does not replace `fileId` not found in replacement context', () => {
      // Act
      const v1Result = Image().copyData(
        { type: 'makeswift-file', id: 'fake-file-id-2', version: 1 },
        context,
      )

      const v0Result = Image().copyData('fake-file-id-2', context)

      // Assert
      expect(v1Result).toEqual({
        type: 'makeswift-file',
        id: 'fake-file-id-2',
        version: 1,
      })

      expect(v0Result).toEqual('fake-file-id-2')
    })

    test('copies external files as is', () => {
      // Act
      const result = Image().copyData(
        { type: 'external-file', url: 'https://example.com', version: 1 },
        context,
      )

      // Assert
      expect(result).toEqual({
        type: 'external-file',
        url: 'https://example.com',
        version: 1,
      })
    })

    test.each([undefined])('gracefully handles %s', (value) => {
      expect(Image().copyData(value, context)).toBe(value)
    })

    test('`fromData` on v0 data will promote to v1 data', () => {
      // Arrange
      const v0Data = 'fake-file-id'

      // Act
      const result = Image().fromData(v0Data)

      expect(result).toMatchSnapshot()
    })
  })

  const invalidValues = [null, 17, { key: 'val' }]

  testImageDefinition(
    Image({ label: 'Image' }),
    [
      {
        type: 'makeswift-file',
        version: 1,
        id: 'fake-file-id',
      },
      {
        type: 'external-file',
        url: fakeImageUrl,
        version: 1,
        width: 100,
        height: 100,
      },
      { type: 'external-file', url: fakeImageUrl, version: 1 },
    ],
    invalidValues,
  )
})
