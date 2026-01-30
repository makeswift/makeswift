import { createReplacementContext, type CopyContext } from '../../context'
import { Targets } from '../../introspection'

import { Image, ImageDefinition } from './image'

const fakeImageUrl = 'https://example.com/image.jpg'

describe('Image', () => {
  describe('constructor', () => {
    test.each([
      Image.Format.URL,
      Image.Format.WithDimensions,
      Image.Format.WithMetadata,
      undefined,
    ])(
      'call with format `%s` returns versioned definition',
      (value) => {
        expect(Image({ label: 'Image', format: value })).toMatchSnapshot()
      },
    )

    test('disallows extraneous properties', () => {
      Image({
        label: undefined,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: ImageDefinition) {}
    assignTest(Image())
    assignTest(Image({ label: 'Image' }))
    // FIXME
    // assignTest(Image({ format: Image.Format.URL }))
    // assignTest(Image({ label: 'Image', format: Image.Format.WithDimensions }))
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

    test('returns `undefined` when file marked for removal', () => {
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          fileIds: { 'fake-file-id-3': null },
        }),
        copyElement: (node) => node,
      }

      // Act
      const v1result = Image().copyData(
        { type: 'makeswift-file', id: 'fake-file-id-3', version: 1 },
        context,
      )

      const v0result = Image().copyData('fake-file-id-3', context)

      // Assert
      expect(v1result).toBeUndefined()
      expect(v0result).toBeUndefined()
    })

    test.each([undefined])('gracefully handles %s', (value) => {
      expect(Image().copyData(value, context)).toBe(value)
    })
  })

  describe('introspect file IDs', () => {
    const def = Image()
    test.each([
      { type: 'makeswift-file', id: 'fake-id', version: 1 } as const,
      'fake-id',
    ])("returns data's `fileId`", (data) => {
      expect(def.introspect(data, Targets.File)).toEqual(['fake-id'])
    })

    test.each([undefined])('gracefully handles %s', (value) => {
      expect(def.introspect(value, Targets.File)).toEqual([])
    })
  })

  describe('fromData', () => {
    test.each([
      {
        type: 'makeswift-file',
        version: 1,
        id: 'fake-file-id',
      },
      {
        type: 'makeswift-file',
        version: 1,
        id: 'fake-file-id',
        altText: 'A beautiful image',
      },
      {
        type: 'external-file',
        url: fakeImageUrl,
        version: 1,
        width: 100,
        height: 100,
      },
      {
        type: 'external-file',
        url: fakeImageUrl,
        version: 1,
        width: 100,
        height: 100,
        altText: 'External image alt',
      },
      { type: 'external-file', url: fakeImageUrl, version: 1 },
    ] as const)('v1 `%s`', (rawData) => {
      const definition = Image()
      // Arrange
      const val = definition.fromData(rawData)
      if (!val) throw new Error('Unexpected null value')

      // Act
      const data = definition.toData(val)

      // Assert
      expect(data).toEqual(rawData)
    })

    test('gracefully handles undefined', () => {
      const definition = Image()
      // Arrange
      const val = definition.fromData(undefined)
      expect(val).toBe(undefined)
    })

    test('v0 definition does NOT promote v0 data', () => {
      const definition = Image()
      const DefinitionClass = definition.constructor as any
      const v0Definition = DefinitionClass.deserialize({
        type: DefinitionClass.type,
        config: definition.config,
      })

      const value = v0Definition.fromData('fake-file-id')

      // Act
      const data = v0Definition.toData(value)

      // Assert
      expect(v0Definition.version).toBe(undefined)
      expect(value).toEqual({
        type: 'makeswift-file',
        id: 'fake-file-id',
      })
      expect(data).toBe('fake-file-id')
    })

    test('v1 definition DOES promote v0 data', () => {
      const definition = Image()

      const value = definition.fromData('fake-file-id')
      if (!value) throw new Error('Unexpected nullish value')

      // Act
      const data = definition.toData(value)

      // Assert
      expect(definition.version).toBe(1)
      expect(value).toEqual({
        type: 'makeswift-file',
        id: 'fake-file-id',
      })
      expect(data).toEqual({
        type: 'makeswift-file',
        id: 'fake-file-id',
        version: 1,
      })
    })
  })

  describe('toData', () => {
    test.each([
      {
        type: 'makeswift-file',
        id: 'fake-file-id',
      },
      {
        type: 'makeswift-file',
        id: 'fake-file-id',
        altText: 'A beautiful image',
      },
      {
        type: 'external-file',
        url: fakeImageUrl,
        width: 100,
        height: 100,
      },
      {
        type: 'external-file',
        url: fakeImageUrl,
        width: 100,
        height: 100,
        altText: 'External image alt',
      },
      { type: 'external-file', url: fakeImageUrl },
    ] as const)(
      'returns v1 data for `%s` when definition version is 1',
      (value) => {
        const definition = Image()
        expect(definition.toData(value)).toMatchSnapshot()
      },
    )

    test('returns v0 value for `%s` when definition is unversioned', () => {
      // Arrange
      const definition = Image()
      const DefinitionClass = definition.constructor as any
      const v0Definition = DefinitionClass.deserialize({
        type: DefinitionClass.type,
        config: definition.config,
      })

      // Act
      const result = v0Definition.toData({
        type: 'makeswift-file',
        id: 'fake-file-id',
      })

      // Assert
      expect(v0Definition.version).toBe(undefined)
      expect(result).toBe('fake-file-id')
    })

    test('throws error for external image value on v0 definition', () => {
      const definition = Image()
      const DefinitionClass = definition.constructor as any
      const v0Definition = DefinitionClass.deserialize({
        type: DefinitionClass.type,
        config: definition.config,
      })

      const toData = () =>
        v0Definition.toData({
          type: 'external-file',
          url: fakeImageUrl,
        })

      // Assert
      expect(v0Definition.version).toBe(undefined)
      expect(toData).toThrowErrorMatchingSnapshot()
    })
  })

  describe('safeParse', () => {
    const definition = Image()

    describe('v0', () => {
      test.each([
        'fake-file-id',
        {
          type: 'makeswift-file',
          version: 1,
          id: 'fake-file-id',
        },
        {
          type: 'makeswift-file',
          version: 1,
          id: 'fake-file-id',
          altText: 'A beautiful image',
        },
        {
          type: 'external-file',
          url: fakeImageUrl,
          version: 1,
          width: 100,
          height: 100,
        },
        {
          type: 'external-file',
          url: fakeImageUrl,
          version: 1,
          width: 100,
          height: 100,
          altText: 'External image alt',
        },
      ])('parses `%s`', (value) => {
        expect(definition.safeParse(value)).toEqual({
          success: true,
          data: value,
        })
      })

      test('parses `undefined`', () => {
        expect(definition.safeParse(undefined)).toEqual({
          success: true,
          data: undefined,
        })
      })

      test.each([
        null,
        17,
        ['foo'],
        { key: 'val' },
        { type: 'makeswift-file' },
      ])('refuses to parse `%s` as invalid input', (value) => {
        expect(definition.safeParse(value)).toEqual({
          success: false,
          error: expect.any(String),
        })
      })
    })
  })
})
