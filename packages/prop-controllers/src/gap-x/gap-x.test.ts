import {
  ControlDataTypeKey,
  Types,
  type PropData,
  type Value,
  type Descriptor,
  type OptionsType,
} from '../prop-controllers'

import { GapX } from './gap-x'

describe('GapX', () => {
  describe('associated types', () => {
    test('descriptor value type is the same as the value type', () => {
      // Arrange
      const value = [
        { value: { value: 17, unit: 'px' }, deviceId: 'desktop' },
      ] satisfies Value<typeof GapX>

      function test(_value: Value<Descriptor<typeof GapX>>) {}

      // Assert
      test(value)
    })

    test('options preset type is correctly filled in', () => {
      // Arrange
      const options = {
        preset: GapX.toPropData(
          [{ value: { value: 17, unit: 'px' }, deviceId: 'desktop' }],
          GapX(),
        ),
      } satisfies OptionsType<typeof GapX>

      // Assert
      expect(options.preset).toEqual({
        [ControlDataTypeKey]: GapX.discriminator.dataKey,
        value: [{ value: { value: 17, unit: 'px' }, deviceId: 'desktop' }],
      })
    })
  })

  describe('function call returns a descriptor', () => {
    test('when called with options value', () => {
      // Act
      const result: Descriptor<typeof GapX> = GapX({
        label: 'horizontal gap',
        defaultValue: { value: 17, unit: 'px' },
      })

      // Assert
      expect(result).toEqual({
        options: {
          label: 'horizontal gap',
          defaultValue: { value: 17, unit: 'px' },
        },
        type: 'GapX',
        version: 1,
      })
    })

    test('when called with options callback', () => {
      // Act
      const makeOptions = () =>
        ({
          label: 'horizontal gap',
          defaultValue: { value: 17, unit: 'px' },
        }) satisfies OptionsType<typeof GapX>

      const result: Descriptor<typeof GapX> = GapX(makeOptions)

      // Assert
      expect(result).toEqual({
        options: makeOptions,
        type: 'GapX',
        version: 1,
      })
    })
  })

  describe('fromPropData', () => {
    test('v1', () => {
      // Arrange
      const data: PropData<typeof GapX> = {
        [ControlDataTypeKey]: GapX.discriminator.dataKey,
        value: [
          {
            deviceId: 'desktop',
            value: { value: 17, unit: 'px' },
          },
        ],
      }

      // Act
      const result = GapX.fromPropData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('v0', () => {
      // Arrange
      const data = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ] satisfies PropData<typeof GapX>

      // Act
      const result = GapX.fromPropData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('toPropData', () => {
    test('returns v1 data when definition version is 1', () => {
      // Arrange
      const definition = {
        type: Types.GapX,
        version: 1,
        options: {},
      } satisfies Descriptor<typeof GapX>

      // Act
      const result = GapX.toPropData(
        [
          {
            deviceId: 'desktop',
            value: { value: 17, unit: 'px' },
          },
        ],
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: GapX.discriminator.dataKey,
        value: [
          {
            deviceId: 'desktop',
            value: { value: 17, unit: 'px' },
          },
        ],
      })
    })

    test('returns v0 value when definition version is not 1', () => {
      // Arrange
      const data = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ] satisfies Value<typeof GapX>

      const definition = {
        type: Types.GapX,
        options: {},
      } satisfies Descriptor<typeof GapX>

      // Act
      const result = GapX.toPropData(data, definition)

      // Assert
      expect(result).toBe(data)
    })
  })
})
