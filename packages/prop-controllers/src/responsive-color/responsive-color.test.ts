import {
  ControlDataTypeKey,
  createReplacementContext,
  RemoveResourceTag,
} from '@makeswift/controls'
import {
  copyResponsiveColorPropControllerData,
  ResponsiveColorData,
} from './responsive-color'

describe('responsive-color', () => {
  describe('copyResponsiveColorPropControllerData', () => {
    describe('v0 data', () => {
      test('replaces swatchId with the replacement resource id', () => {
        const data: ResponsiveColorData = [
          {
            deviceId: 'deviceId',
            value: { swatchId: 'swatch-id-1', alpha: 1 },
          },
        ]

        const result = copyResponsiveColorPropControllerData(data, {
          replacementContext: createReplacementContext({
            swatchIds: { 'swatch-id-1': 'new-swatch-id' },
          }),
          copyElement: (el) => el,
        })

        expect(result).toEqual([
          {
            deviceId: 'deviceId',
            value: { swatchId: 'new-swatch-id', alpha: 1 },
          },
        ])
      })

      test('removes swatchId if marked for deletion', () => {
        const data: ResponsiveColorData = [
          {
            deviceId: 'deviceId',
            value: { swatchId: 'swatch-id-1', alpha: 1 },
          },
          {
            deviceId: 'mobile',
            value: { swatchId: 'swatch-id-2', alpha: 1 },
          },
        ]

        const result = copyResponsiveColorPropControllerData(data, {
          replacementContext: createReplacementContext({
            swatchIds: { 'swatch-id-1': RemoveResourceTag },
          }),
          copyElement: (el) => el,
        })

        expect(result).toEqual([
          {
            deviceId: 'mobile',
            value: { swatchId: 'swatch-id-2', alpha: 1 },
          },
        ])
      })
    })

    describe('v1 data', () => {
      test('replaces swatchId with the replacement resource id', () => {
        const data = {
          [ControlDataTypeKey]:
            'prop-controllers::responsive-color::v1' as const,
          value: [
            {
              deviceId: 'deviceId',
              value: { swatchId: 'swatch-id-1', alpha: 1 },
            },
          ],
        }

        const result = copyResponsiveColorPropControllerData(data, {
          replacementContext: createReplacementContext({
            swatchIds: { 'swatch-id-1': 'new-swatch-id' },
          }),
          copyElement: (el) => el,
        })

        expect(result).toEqual({
          [ControlDataTypeKey]: 'prop-controllers::responsive-color::v1',
          value: [
            {
              deviceId: 'deviceId',
              value: { swatchId: 'new-swatch-id', alpha: 1 },
            },
          ],
        })
      })

      test('removes swatchId if marked for deletion', () => {
        const data = {
          [ControlDataTypeKey]:
            'prop-controllers::responsive-color::v1' as const,
          value: [
            {
              deviceId: 'deviceId',
              value: { swatchId: 'swatch-id-1', alpha: 1 },
            },
            {
              deviceId: 'mobile',
              value: { swatchId: 'swatch-id-2', alpha: 1 },
            },
          ],
        }

        const result = copyResponsiveColorPropControllerData(data, {
          replacementContext: createReplacementContext({
            swatchIds: { 'swatch-id-1': RemoveResourceTag },
          }),
          copyElement: (el) => el,
        })

        expect(result).toEqual({
          [ControlDataTypeKey]: 'prop-controllers::responsive-color::v1',
          value: [
            {
              deviceId: 'mobile',
              value: { swatchId: 'swatch-id-2', alpha: 1 },
            },
          ],
        })
      })
    })
  })
})
