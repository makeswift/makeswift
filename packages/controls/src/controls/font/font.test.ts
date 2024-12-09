import { Font, FontDefinition } from './font'

describe('Font', () => {
  describe('constructor', () => {
    test.each([
      {},
      { variant: true },
      {
        defaultValue: {
          fontFamily: 'comic sans',
          fontStyle: 'normal',
          fontWeight: 500,
        },
      },
      {
        variant: true,
        defaultValue: {
          fontFamily: 'comic sans',
          fontStyle: 'normal',
          fontWeight: 500,
        },
      },
      { variant: false },
      {
        variant: false,
        defaultValue: {
          fontFamily: 'comic sans',
        },
      },
    ])('returns correct definition', ({ variant, defaultValue }) => {
      // Arrange
      const definition = Font({ variant, defaultValue })

      // Assert
      expect(definition).toMatchSnapshot()
    })

    test.each([
      {
        fontFamily: 'comic sans',
        fontStyle: 'foo',
        fontWeight: 500,
      } as const,
      {
        fontFamily: 'comic sans',
        fontStyle: 'normal',
        fontWeight: 350,
      } as const,
    ])('non literal fontStyle and fontWeight values error', (defaultValue) => {
      // @ts-expect-error
      Font({ defaultValue })
    })

    test('disallows extraneous properties', () => {
      Font({
        label: 'Font family',
        variant: false,
        //@ts-expect-error
        foo: 'bar',
        defaultValue: {
          fontFamily: 'comic sans',
        },
      })
    })

    test('disallows extraneous sub-properties', () => {
      Font({
        label: 'Font family',
        variant: false,
        defaultValue: {
          fontFamily: 'comic sans',
          //@ts-expect-error
          foo: 'bar',
        },
      })
    })

    test('disallows extraneous sub-properties', () => {
      Font({
        label: 'Font family',
        variant: true,
        defaultValue: {
          fontFamily: 'comic sans',
          //@ts-expect-error
          foo: 'bar',
        },
      })
    })

    test('disallows extraneous sub-properties that are otherwise permissible when variant === true', () => {
      Font({
        label: 'Font family',
        variant: false,
        defaultValue: {
          fontFamily: 'comic sans',
          //@ts-expect-error
          fontStyle: 'normal',
        },
      })
    })
  })

  describe('assignability', () => {
    // Arrange
    function assignTest(_def: FontDefinition) {}

    // Assert
    assignTest(Font())
    assignTest(Font({ variant: false }))
    assignTest(Font({ variant: true }))
    assignTest(
      Font({
        variant: true,
        defaultValue: { fontFamily: '', fontStyle: 'normal', fontWeight: 400 },
      }),
    )
    assignTest(
      Font({
        variant: false,
        defaultValue: { fontFamily: '' },
      }),
    )
  })

  describe('copyData', () => {
    test('copyData when variant === true', () => {
      const data = {
        '@@makeswift/type': 'font::v1' as const,
        value: {
          fontFamily: 'comic sans',
          fontStyle: 'normal',
          fontWeight: 400,
        },
      } as const

      // Arrange
      const definition = Font()

      // Act
      const copiedData = definition.copyData(data)

      // Assert
      expect(copiedData).not.toBe(data)
      expect(copiedData).toEqual(data)
    })

    test('copyData when variant === false', () => {
      const data = {
        '@@makeswift/type': 'font::v1' as const,
        value: {
          fontFamily: 'comic sans',
        },
      }

      // Arrange
      const definition = Font({ variant: false })

      // Act
      //@ts-expect-error
      Font().copyData(data)

      const copiedData = definition.copyData(data)

      // Assert
      expect(copiedData).not.toBe(data)
      expect(copiedData).toEqual(data)
    })
  })

  describe('fromData', () => {
    test.each([
      {
        config: { variant: true },
        rawData: {
          '@@makeswift/type': 'font::v1' as const,
          value: {
            fontFamily: 'comic sans',
            fontStyle: 'normal',
            fontWeight: 400,
          },
        },
      },
      {
        config: {},
        rawData: {
          '@@makeswift/type': 'font::v1' as const,
          value: {
            fontFamily: 'comic sans',
            fontStyle: 'normal',
            fontWeight: 400,
          },
        },
      },
      {
        config: { variant: false },
        rawData: {
          '@@makeswift/type': 'font::v1' as const,
          value: {
            fontFamily: 'comic sans',
          },
        },
      },
    ] as const)('`%s`', ({ config, rawData }) => {
      const definition = Font(config)
      // Arrange
      const val = definition.fromData(rawData)

      // Act
      const data = definition.toData(val)

      // Assert
      expect(data).toEqual(rawData)
    })

    test.each([
      { variant: true },
      { variant: false },
      {
        variant: true,
        defaultValue: {
          fontFamily: 'comic sans',
          fontStyle: 'normal',
          fontWeight: 400,
        },
      },
      { variant: false, defaultValue: { fontFamily: 'comic sans' } },
    ] as const)('gracefully handle undefined `%s`', (config) => {
      const definition = Font(config)
      // Arrange
      const val = definition.fromData(undefined)

      // Act
      const data = definition.toData(val)

      // Assert
      expect(data).toEqual(undefined)
    })
  })

  describe('toData', () => {
    test.each([
      {
        config: { variant: true },
        value: {
          fontFamily: 'comic sans',
          fontStyle: 'normal',
          fontWeight: 400,
        },
      },
      {
        config: {},
        value: {
          fontFamily: 'comic sans',
          fontStyle: 'normal',
          fontWeight: 400,
        },
      },
      {
        config: { variant: false },
        value: {
          fontFamily: 'comic sans',
        },
      },
    ] as const)('`%s`', ({ config, value }) => {
      // Arrange
      const definition = Font(config)

      // Assert
      expect(definition.toData(value)).toMatchSnapshot()
    })

    test.each([
      { variant: true },
      { variant: false },
      {
        variant: true,
        defaultValue: {
          fontFamily: 'comic sans',
          fontStyle: 'normal',
          fontWeight: 400,
        },
      },
      { variant: false, defaultValue: { fontFamily: 'comic sans' } },
    ] as const)('gracefully handle undefined `%s`', (config) => {
      // Arrange
      const definition = Font(config)

      // Assert
      expect(definition.toData(undefined)).toMatchSnapshot()
    })
  })
})
