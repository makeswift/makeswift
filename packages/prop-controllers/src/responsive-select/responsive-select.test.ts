import {
  ControlDataTypeKey,
  Types,
  type PropData,
  type Value,
  type Descriptor,
} from '../prop-controllers'

import { ResponsiveSelect } from './responsive-select'

describe('ResponsiveSelect', () => {
  describe('associated types', () => {
    test('descriptor value type is the same as the value type', () => {
      // Arrange
      const value = [{ value: 'hi', deviceId: 'desktop' }] satisfies Value<
        typeof ResponsiveSelect
      >

      function test(_value: Value<Descriptor<typeof ResponsiveSelect>>) {}

      // Assert
      test(value)
    })
  })

  describe('function call returns a descriptor', () => {
    test('when called with options value', () => {
      // Act
      const result = ResponsiveSelect({
        label: 'Style',
        labelOrientation: 'horizontal',
        options: [
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
          { value: 'blended', label: 'Blended' },
        ],
        defaultValue: 'solid',
      })

      // Assert
      expect(result).toEqual({
        options: {
          label: 'Style',
          labelOrientation: 'horizontal',
          options: [
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'blended', label: 'Blended' },
          ],
          defaultValue: 'solid',
        },
        type: 'ResponsiveSelect',
        version: 1,
      })
    })

    test('when called with options callback', () => {
      // Act
      const result = ResponsiveSelect(() => ({
        label: 'Style',
        labelOrientation: 'horizontal',
        options: [
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
          { value: 'blended', label: 'Blended' },
        ],
        defaultValue: 'solid',
      }))

      // Assert
      expect(result).toEqual({
        options: result.options,
        type: 'ResponsiveSelect',
        version: 1,
      })
    })
  })

  describe('fromPropData', () => {
    test('v1', () => {
      // Arrange
      const data: PropData<typeof ResponsiveSelect> = {
        [ControlDataTypeKey]: ResponsiveSelect.discriminator.dataKey,
        value: [
          {
            deviceId: 'desktop',
            value: 'solid',
          },
        ],
      }

      // Act
      const result = ResponsiveSelect.fromPropData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('v0', () => {
      // Arrange
      const data = [
        {
          deviceId: 'desktop',
          value: 'solid',
        },
      ] satisfies PropData<typeof ResponsiveSelect>

      // Act
      const result = ResponsiveSelect.fromPropData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('toPropData', () => {
    test('returns v1 data when definition version is 1', () => {
      // Arrange
      const definition = {
        type: Types.ResponsiveSelect,
        version: 1,
        options: {
          options: [
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'blended', label: 'Blended' },
          ],
        },
      } satisfies Descriptor<typeof ResponsiveSelect>

      // Act
      const result = ResponsiveSelect.toPropData(
        [
          {
            deviceId: 'desktop',
            value: 'solid',
          },
        ],
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: ResponsiveSelect.discriminator.dataKey,
        value: [
          {
            deviceId: 'desktop',
            value: 'solid',
          },
        ],
      })
    })

    test('returns v0 value when definition version is not 1', () => {
      // Arrange
      const data = [
        {
          deviceId: 'desktop',
          value: 'solid',
        },
      ] satisfies Value<typeof ResponsiveSelect>

      const definition = {
        type: Types.ResponsiveSelect,
        options: {
          options: [
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'blended', label: 'Blended' },
          ],
        },
      } satisfies Descriptor<typeof ResponsiveSelect>

      // Act
      const result = ResponsiveSelect.toPropData(data, definition)

      // Assert
      expect(result).toBe(data)
    })
  })
})
