import {
  ControlDataTypeKey,
  createReplacementContext,
} from '@makeswift/controls'
import {
  copyResponsiveColorPropControllerData,
  createResponsiveColorPropControllerDataFromResponsiveColorData,
  getResponsiveColorPropControllerDataResponsiveColorData,
  getResponsiveColorPropControllerDataSwatchIds,
  ResponsiveColorDataV1,
  ResponsiveColor,
  ResponsiveColorData,
} from './responsive-color'

describe('responsive-color', () => {
  describe('copyResponsiveColorPropControllerData', () => {
    describe('v0 data', () => {
      test('replaces swatchId with the replacement resource id', () => {
        const data: ResponsiveColorDataV1 = [
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
        const data: ResponsiveColorDataV1 = [
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
            swatchIds: { 'swatch-id-1': null },
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
            swatchIds: { 'swatch-id-1': null },
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

  describe('v1 colors', () => {
    const valueV1: ResponsiveColorDataV1 = [
      { deviceId: 'desktop', value: { swatchId: 'swatch-id-1', alpha: 1 } },
    ]
    const value: ResponsiveColorData = [
      {
        deviceId: 'desktop',
        value: { type: 'swatch', swatchId: 'swatch-id-1', alpha: 1 },
      },
    ]

    test.each([
      valueV1,
      {
        [ControlDataTypeKey]: 'prop-controllers::responsive-color::v1' as const,
        value: valueV1,
      },
    ])('is read as swatch colors', (data) => {
      expect(
        getResponsiveColorPropControllerDataResponsiveColorData(data),
      ).toEqual(value)
    })

    test('is written by v1 descriptors', () => {
      expect(
        createResponsiveColorPropControllerDataFromResponsiveColorData(
          { type: ResponsiveColor().type, version: 1, options: {} },
          value,
        ),
      ).toEqual({
        [ControlDataTypeKey]: 'prop-controllers::responsive-color::v1',
        value: valueV1,
      })
    })
  })

  describe('v2 data', () => {
    const value: ResponsiveColorData = [
      {
        deviceId: 'desktop',
        value: { type: 'swatch', swatchId: 'swatch-id-1', alpha: 1 },
      },
      {
        deviceId: 'mobile',
        value: {
          type: 'inline',
          hue: 238,
          saturation: 87,
          lightness: 49,
          alpha: 0.5,
        },
      },
    ]
    const data = createResponsiveColorPropControllerDataFromResponsiveColorData(
      ResponsiveColor(),
      value,
    )

    test('is written by the current descriptor', () => {
      expect(data).toEqual({
        [ControlDataTypeKey]: 'prop-controllers::responsive-color::v2',
        value,
      })
    })

    test('is read', () => {
      expect(
        getResponsiveColorPropControllerDataResponsiveColorData(data),
      ).toBe(value)
    })

    test('returns only swatch ids', () => {
      expect(getResponsiveColorPropControllerDataSwatchIds(data)).toEqual([
        'swatch-id-1',
      ])
    })

    test('copies swatches and leaves inline colors as is', () => {
      expect(
        copyResponsiveColorPropControllerData(data, {
          replacementContext: createReplacementContext({
            swatchIds: { 'swatch-id-1': 'new-swatch-id' },
          }),
          copyElement: (el) => el,
        }),
      ).toEqual({
        [ControlDataTypeKey]: 'prop-controllers::responsive-color::v2',
        value: [
          {
            deviceId: 'desktop',
            value: { type: 'swatch', swatchId: 'new-swatch-id', alpha: 1 },
          },
          value[1],
        ],
      })
    })
  })
})
