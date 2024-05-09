import {
  ControlDataTypeKey,
  Types,
  type PropData,
  type Value,
  type Descriptor,
} from '../prop-controllers'

import { ResponsiveOpacity } from './responsive-opacity'

describe('ResponsiveOpacity', () => {
  describe('fromPropData', () => {
    test('v1', () => {
      // Arrange
      const propData = {
        [ControlDataTypeKey]: ResponsiveOpacity.discriminator.dataKey,
        value: [
          {
            deviceId: 'desktop',
            value: 17,
          },
        ],
      } satisfies PropData<typeof ResponsiveOpacity>

      // Act
      const result = ResponsiveOpacity.fromPropData(propData)

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
      ] satisfies PropData<typeof ResponsiveOpacity>

      // Act
      const result = ResponsiveOpacity.fromPropData(propData)

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
      ] satisfies Value<typeof ResponsiveOpacity>

      const descriptor = {
        type: Types.ResponsiveOpacity,
        version: 1,
        options: {},
      } satisfies Descriptor<typeof ResponsiveOpacity>

      // Act
      const result = ResponsiveOpacity.toPropData(data, descriptor)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: ResponsiveOpacity.discriminator.dataKey,
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
      ] satisfies Value<typeof ResponsiveOpacity>

      const descriptor = {
        type: Types.ResponsiveOpacity,
        options: {},
      } satisfies Descriptor<typeof ResponsiveOpacity>

      // Act
      const result = ResponsiveOpacity.toPropData(data, descriptor)

      // Assert
      expect(result).toBe(data)
    })
  })
})
