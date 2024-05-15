import {
  ControlDataTypeKey,
  Types,
  type PropData,
  type Value,
  type Descriptor,
} from '../prop-controllers'

import { ResponsiveIconRadioGroup } from './responsive-icon-radio-group'

describe('ResponsiveIconRadioGroup', () => {
  describe('associated types', () => {
    test('descriptor value type is the same as the value type', () => {
      // Arrange
      const value = [{ value: 'hi', deviceId: 'desktop' }] satisfies Value<
        typeof ResponsiveIconRadioGroup
      >

      function test(
        _value: Value<Descriptor<typeof ResponsiveIconRadioGroup>>,
      ) {}

      // Assert
      test(value)
    })
  })

  describe('function call returns a descriptor', () => {
    test('when called with options value', () => {
      // Act
      const result = ResponsiveIconRadioGroup({
        label: 'Height',
        options: [
          { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
          { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
        ],
        defaultValue: 'auto',
      })

      // Assert
      expect(result).toEqual({
        options: {
          label: 'Height',
          options: [
            { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
            { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
          ],
          defaultValue: 'auto',
        },
        type: 'ResponsiveIconRadioGroup',
        version: 1,
      })
    })

    test('when called with options callback', () => {
      // Act
      const result = ResponsiveIconRadioGroup(() => ({
        label: 'Height',
        options: [
          { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
          { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
        ],
        defaultValue: 'auto',
      }))

      // Assert
      expect(result).toEqual({
        options: result.options,
        type: 'ResponsiveIconRadioGroup',
        version: 1,
      })
    })
  })

  describe('fromPropData', () => {
    test('v1', () => {
      // Arrange
      const data: PropData<typeof ResponsiveIconRadioGroup> = {
        [ControlDataTypeKey]: ResponsiveIconRadioGroup.discriminator.dataKey,
        value: [
          {
            deviceId: 'desktop',
            value: 'stretch',
          },
        ],
      }

      // Act
      const result = ResponsiveIconRadioGroup.fromPropData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('v0', () => {
      // Arrange
      const data = [
        {
          deviceId: 'desktop',
          value: 'stretch',
        },
      ] satisfies PropData<typeof ResponsiveIconRadioGroup>

      // Act
      const result = ResponsiveIconRadioGroup.fromPropData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('toPropData', () => {
    test('returns v1 data when definition version is 1', () => {
      // Arrange
      const definition = {
        type: Types.ResponsiveIconRadioGroup,
        version: 1,
        options: {
          options: [
            { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
            { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
          ],
        },
      } satisfies Descriptor<typeof ResponsiveIconRadioGroup>

      // Act
      const result = ResponsiveIconRadioGroup.toPropData(
        [
          {
            deviceId: 'desktop',
            value: 'stretch',
          },
        ],
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: ResponsiveIconRadioGroup.discriminator.dataKey,
        value: [
          {
            deviceId: 'desktop',
            value: 'stretch',
          },
        ],
      })
    })

    test('returns v0 value when definition version is not 1', () => {
      // Arrange
      const data = [
        {
          deviceId: 'desktop',
          value: 'stretch',
        },
      ] satisfies Value<typeof ResponsiveIconRadioGroup>

      const definition = {
        type: Types.ResponsiveIconRadioGroup,
        options: {
          options: [
            { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
            { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
          ],
        },
      } satisfies Descriptor<typeof ResponsiveIconRadioGroup>

      // Act
      const result = ResponsiveIconRadioGroup.toPropData(data, definition)

      // Assert
      expect(result).toBe(data)
    })
  })
})
