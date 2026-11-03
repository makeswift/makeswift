import { createReplacementContext } from '@makeswift/controls'
import { ControlDataTypeKey, type ResponsiveValue } from '../prop-controllers'
import {
  Shadows,
  ShadowsData,
  ShadowsPropControllerData,
  copyShadowsPropControllerData,
  createShadowsPropControllerDataFromResponsiveShadowsData,
  getShadowsPropControllerDataResponsiveShadowsData,
  getShadowsPropControllerDataSwatchIds,
} from './shadows'

describe('copyShadowsPropControllerData', () => {
  test('replaces the swatch id', () => {
    // Arrange
    const data: ShadowsPropControllerData = [
      {
        value: [
          {
            id: '8575efe6-4d04-4361-b593-e559537c4c3c',
            payload: {
              color: {
                alpha: 1,
                swatchId:
                  'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==',
              },
              offsetX: -5,
              offsetY: 8.7,
              blurRadius: 17,
              spreadRadius: 16,
            },
          },
        ],
        deviceId: 'desktop',
      },
    ]
    const expected = JSON.parse(
      JSON.stringify(data).replace(
        'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==',
        'testing',
      ),
    )

    // Act
    const result = copyShadowsPropControllerData(data, {
      replacementContext: createReplacementContext({
        swatchIds: {
          'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==':
            'testing',
        },
      }),
      copyElement: (node) => node,
    })

    // // Assert
    expect(result).toMatchObject(expected)
  })

  test('removes color where swatchId is marked for removal', () => {
    const data: ShadowsPropControllerData = [
      {
        value: [
          {
            id: '00000000-0000-0000-0000-000000000001',
            payload: {
              color: { alpha: 1, swatchId: 'swatch-id-1' },
              offsetX: 4,
              offsetY: 4,
              blurRadius: 4,
              spreadRadius: 4,
            },
          },
        ],
        deviceId: 'desktop',
      },
      {
        value: [
          {
            id: '00000000-0000-0000-0000-000000000002',
            payload: {
              color: { alpha: 1, swatchId: 'swatch-id-2' },
              offsetX: 0,
              offsetY: 0,
              blurRadius: 0,
              spreadRadius: 0,
            },
          },
        ],
        deviceId: 'tablet',
      },
    ]

    // Act
    const result = copyShadowsPropControllerData(data, {
      replacementContext: createReplacementContext({
        swatchIds: { 'swatch-id-1': null },
      }),
      copyElement: (node) => node,
    })

    // // Assert
    expect(result).toMatchObject([
      {
        value: [
          {
            id: '00000000-0000-0000-0000-000000000001',
            payload: {
              color: undefined,
              offsetX: 4,
              offsetY: 4,
              blurRadius: 4,
              spreadRadius: 4,
            },
          },
        ],
        deviceId: 'desktop',
      },
      {
        value: [
          {
            id: '00000000-0000-0000-0000-000000000002',
            payload: {
              color: { alpha: 1, swatchId: 'swatch-id-2' },
              offsetX: 0,
              offsetY: 0,
              blurRadius: 0,
              spreadRadius: 0,
            },
          },
        ],
        deviceId: 'tablet',
      },
    ])
  })
})

describe('v2 shadows data', () => {
  const value: ResponsiveValue<ShadowsData> = [
    {
      deviceId: 'desktop',
      value: [
        {
          id: '1',
          payload: {
            color: { type: 'swatch', swatchId: 'swatch-id-1', alpha: 1 },
          },
        },
        {
          id: '2',
          payload: {
            color: {
              type: 'inline',
              hue: 238,
              saturation: 87,
              lightness: 49,
              alpha: 0.5,
            },
          },
        },
      ],
    },
  ]
  const data = createShadowsPropControllerDataFromResponsiveShadowsData(
    Shadows(),
    value,
  )

  test('is written by the current descriptor', () => {
    expect(data).toEqual({
      [ControlDataTypeKey]: 'prop-controllers::shadows::v2',
      value,
    })
  })

  test('is read', () => {
    expect(getShadowsPropControllerDataResponsiveShadowsData(data)).toBe(value)
  })

  test('returns only swatch ids', () => {
    expect(getShadowsPropControllerDataSwatchIds(data)).toEqual(['swatch-id-1'])
  })

  test('copies swatches and leaves inline colors as is', () => {
    expect(
      copyShadowsPropControllerData(data, {
        replacementContext: createReplacementContext({
          swatchIds: { 'swatch-id-1': 'new-swatch-id' },
        }),
        copyElement: (el) => el,
      }),
    ).toEqual({
      [ControlDataTypeKey]: 'prop-controllers::shadows::v2',
      value: [
        {
          deviceId: 'desktop',
          value: [
            {
              id: '1',
              payload: {
                color: { type: 'swatch', swatchId: 'new-swatch-id', alpha: 1 },
              },
            },
            value[0].value[1],
          ],
        },
      ],
    })
  })
})
