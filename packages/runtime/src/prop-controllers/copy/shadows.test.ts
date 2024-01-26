import { describe, test, expect } from 'vitest'
import { ShadowsValue } from '../descriptors'
import { copy } from './shadows'
import { ReplacementContext } from '../../state/react-page'

describe.concurrent('shadow copy', () => {
  test('replaces the swatch id', () => {
    // Arrange
    const data: ShadowsValue = [
      {
        value: [
          {
            id: '8575efe6-4d04-4361-b593-e559537c4c3c',
            payload: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==',
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

    const replacementContext = {
      elementHtmlIds: new Set(),
      elementKeys: new Map(),
      swatchIds: new Map([
        ['U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==', 'testing'],
      ]),
      fileIds: new Map(),
      typographyIds: new Map(),
      tableIds: new Map(),
      tableColumnIds: new Map(),
      pageIds: new Map(),
      globalElementIds: new Map(),
      globalElementData: new Map(),
    }

    // Act
    const result = copy(data, {
      replacementContext: replacementContext as ReplacementContext,
      copyElement: node => node,
    })

    // // Assert
    expect(result).toMatchObject(expected)
  })
})
