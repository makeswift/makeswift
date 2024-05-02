import {
  ControlDataTypeKey,
  Types,
  type PropData,
  type Value,
  type Descriptor,
} from '../prop-controllers'

import { ResponsiveNumber } from './responsive-number'

describe('ResponsiveNumber', () => {
  describe('fromPropData', () => {
    test('v1', () => {
      // Arrange
      const propData = {
        [ControlDataTypeKey]: ResponsiveNumber.discriminator.dataKey,
        value: [
          {
            deviceId: 'desktop',
            value: 17,
          },
        ],
      } satisfies PropData<typeof ResponsiveNumber>

      // Act
      const result = ResponsiveNumber.fromPropData(propData)

      // Assert
      expect(result).toEqual(propData.value)
    })

    test('v0', () => {
      // Arrange
      const propData = [
        {
          deviceId: 'desktop',
          value: 17,
        },
      ] satisfies PropData<typeof ResponsiveNumber>

      // Act
      const result = ResponsiveNumber.fromPropData(propData)

      // Assert
      expect(result).toEqual(propData)
    })
  })

  describe('toPropData', () => {
    test('returns v1 data when definition version is 1', () => {
      // Arrange
      const data = [
        {
          deviceId: 'desktop',
          value: 17,
        },
      ] satisfies Value<typeof ResponsiveNumber>

      const descriptor = {
        type: Types.ResponsiveNumber,
        version: 1,
        options: {},
      } satisfies Descriptor<typeof ResponsiveNumber>

      // Act
      const result = ResponsiveNumber.toPropData(data, descriptor)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: ResponsiveNumber.discriminator.dataKey,
        value: [
          {
            deviceId: 'desktop',
            value: 17,
          },
        ],
      })
    })

    test('returns v0 value when definition version is not 1', () => {
      // Arrange
      const data = [
        {
          deviceId: 'desktop',
          value: 17,
        },
      ] satisfies Value<typeof ResponsiveNumber>

      const descriptor = {
        type: Types.ResponsiveNumber,
        options: {},
      } satisfies Descriptor<typeof ResponsiveNumber>

      // Act
      const result = ResponsiveNumber.toPropData(data, descriptor)

      // Assert
      expect(result).toBe(data)
    })
  })
})
